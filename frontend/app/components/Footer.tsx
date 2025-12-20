export default function Footer() {
  return (
    <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <div className="footer-item">
              <h4 className="text-light mb-3">Parapharmacie</h4>
              <p className="mb-4">Votre parapharmacie en ligne pour tous vos produits de santé et beauté.</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="d-flex flex-column text-start footer-item">
              <h4 className="text-light mb-3">Informations</h4>
              <a className="btn-link" href="">À propos</a>
              <a className="btn-link" href="">Contact</a>
              <a className="btn-link" href="">Politique de confidentialité</a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="footer-item">
              <h4 className="text-light mb-3">Contact</h4>
              <p>Adresse: 123 Rue Example, Paris</p>
              <p>Email: contact@parapharmacie.com</p>
              <p>Téléphone: +33 1 23 45 67 89</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
