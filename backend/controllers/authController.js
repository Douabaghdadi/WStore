const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const https = require('https');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updateData = { name, email, role };
    
    if (req.file) {
      updateData.photo = `/uploads/users/${req.file.filename}`;
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.facebookLogin = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code d\'autorisation manquant' });
    }
    
    // Échanger le code contre un token d'accès
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&redirect_uri=${encodeURIComponent('http://localhost:3000/login')}&code=${code}`;
    
    https.get(tokenUrl, (tokenResponse) => {
      let tokenData = '';
      
      tokenResponse.on('data', (chunk) => {
        tokenData += chunk;
      });
      
      tokenResponse.on('end', async () => {
        try {
          const tokenResult = JSON.parse(tokenData);
          
          if (tokenResult.error) {
            console.log('Facebook token error:', tokenResult.error);
            return res.status(401).json({ error: 'Code d\'autorisation invalide: ' + tokenResult.error.message });
          }
          
          const accessToken = tokenResult.access_token;
          
          // Utiliser le token pour récupérer les infos utilisateur
          const userUrl = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`;
          
          https.get(userUrl, (userResponse) => {
            let userData = '';
            
            userResponse.on('data', (chunk) => {
              userData += chunk;
            });
            
            userResponse.on('end', async () => {
              try {
                const fbUser = JSON.parse(userData);
                
                if (fbUser.error) {
                  return res.status(401).json({ error: 'Token Facebook invalide' });
                }
                
                // Chercher ou créer l'utilisateur
                let user = await User.findOne({ email: fbUser.email });
                
                if (!user) {
                  // Créer un nouveau utilisateur
                  user = await User.create({
                    email: fbUser.email,
                    name: fbUser.name,
                    facebookId: fbUser.id,
                    password: await bcrypt.hash(Math.random().toString(36), 10)
                  });
                } else if (!user.facebookId) {
                  // Lier le compte Facebook à l'utilisateur existant
                  user.facebookId = fbUser.id;
                  await user.save();
                }
                
                const token = jwt.sign(
                  { id: user._id, role: user.role }, 
                  process.env.JWT_SECRET || 'secret', 
                  { expiresIn: '7d' }
                );
                
                res.json({ 
                  token, 
                  user: { 
                    id: user._id, 
                    email: user.email, 
                    role: user.role, 
                    name: user.name 
                  } 
                });
              } catch (parseError) {
                res.status(500).json({ error: 'Erreur lors de la récupération des données utilisateur' });
              }
            });
          }).on('error', (err) => {
            res.status(500).json({ error: 'Erreur de connexion à Facebook' });
          });
        } catch (parseError) {
          console.log('Parse error:', parseError);
          res.status(500).json({ error: 'Erreur lors de l\'analyse de la réponse Facebook' });
        }
      });
    }).on('error', (err) => {
      console.log('Request error:', err);
      res.status(500).json({ error: 'Erreur de connexion à Facebook' });
    });
  } catch (error) {
    console.log('General error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code d\'autorisation manquant' });
    }
    
    // Échanger le code contre un token d'accès
    const tokenUrl = `https://oauth2.googleapis.com/token`;
    const tokenData = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/login'
    };
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenData)
    });
    
    const tokenResult = await tokenResponse.json();
    
    if (tokenResult.error) {
      console.log('Google token error:', tokenResult.error);
      return res.status(401).json({ error: 'Code d\'autorisation invalide: ' + tokenResult.error });
    }
    
    const accessToken = tokenResult.access_token;
    
    // Utiliser le token pour récupérer les infos utilisateur
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    const googleUser = await userResponse.json();
    
    if (googleUser.error) {
      return res.status(401).json({ error: 'Token Google invalide' });
    }
    
    // Chercher ou créer l'utilisateur
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      // Créer un nouveau utilisateur
      user = await User.create({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        password: await bcrypt.hash(Math.random().toString(36), 10)
      });
    } else if (!user.googleId) {
      // Lier le compte Google à l'utilisateur existant
      user.googleId = googleUser.id;
      await user.save();
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.log('Google auth error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Aucun compte trouvé avec cet email' });
    }
    
    // Générer un token de récupération
    const resetToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1h' }
    );
    
    // Sauvegarder le token dans la base de données
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();
    
    // Temporaire : retourner le lien directement au lieu d'envoyer un email
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log('Lien de récupération généré:', resetUrl);
    
    res.json({ 
      message: 'Lien de récupération généré avec succès',
      resetUrl: resetUrl
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du lien' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }
    
    // Mettre à jour le mot de passe
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(400).json({ error: 'Token invalide ou expiré' });
  }
};
