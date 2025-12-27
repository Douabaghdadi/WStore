'use client';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../../lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero Start */}
      <div className="container-fluid py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-12 col-lg-7">
              <h4 className="mb-3" style={{color: '#ffb524'}}>Santé & Bien-être Naturel</h4>
              <h1 className="mb-5 display-3" style={{color: '#81c408', fontWeight: 800}}>Votre Parapharmacie en Ligne</h1>
              <div className="position-relative mx-auto">
                <input className="form-control w-75 py-3 px-4 rounded-pill" type="text" placeholder="Search" style={{border: '2px solid #ffb524'}} />
                
              </div>
            </div>
            <div className="col-md-12 col-lg-5">
              <div id="carouselId" className="carousel slide position-relative" data-bs-ride="carousel">
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active rounded">
                    <img src="/img/hero-img-1.png" className="img-fluid w-100 h-100 rounded" alt="First slide" style={{backgroundColor: '#ffb524'}} />
                  </div>
                  <div className="carousel-item rounded">
                    <img src="/img/hero-img-2.jpg" className="img-fluid w-100 h-100 rounded" alt="Second slide" />
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselId" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselId" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hero End */}

      {/* Featurs Section Start */}
      <div className="container-fluid featurs py-5">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4 h-100 d-flex flex-column">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className="fas fa-car-side fa-3x text-white"></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>Livraison Gratuite</h5>
                  <p className="mb-0" style={{minHeight: '48px'}}>Dès 100 DT d'achat dans toute la Tunisie</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4 h-100 d-flex flex-column">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className="fas fa-user-shield fa-3x text-white"></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>Paiement sécurisé</h5>
                  <p className="mb-0" style={{minHeight: '48px'}}>Paiement 100% sécurisé</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4 h-100 d-flex flex-column">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className="fas fa-exchange-alt fa-3x text-white"></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>Meilleurs prix</h5>
                  <p className="mb-0" style={{minHeight: '48px'}}>Bénéficiez du prix le plus bas dans la marché tunisien</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4 h-100 d-flex flex-column">
                <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                  <i className="fa fa-phone-alt fa-3x text-white"></i>
                </div>
                <div className="featurs-content text-center">
                  <h5>Service client</h5>
                  <p className="mb-0" style={{minHeight: '48px'}}>Contactez-nous sur :
(+216) 29 135 995</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Featurs Section End */}

      {/* Fruits Shop Start */}
      <div className="container-fluid fruite py-5">
        <div className="container py-5">
          <div className="tab-class text-center">
            <div className="row g-4">
              <div className="col-lg-4 text-start">
                <h1>Nos produits</h1>
              </div>
              <div className="col-lg-8 text-end">
                <ul className="nav nav-pills d-inline-flex text-center mb-5">
                  <li className="nav-item">
                    <a className="d-flex m-2 py-2 bg-light rounded-pill active" data-bs-toggle="pill" href="#tab-1">
                      <span className="text-dark" style={{width: '130px'}}>Tout les produits</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="tab-content">
              <div id="tab-1" className="tab-pane fade show p-0 active">
                <div className="row g-4">
                  <div className="col-lg-12">
                    {loading ? (
                      <div className="text-center">
                        <div className="spinner-grow text-primary" role="status" key="loading-spinner"></div>
                      </div>
                    ) : (
                      <div className="row g-4">
                        {products.map((product, index) => (
                          <div key={product._id || `product-${index}`} className="col-md-6 col-lg-4 col-xl-3">
                            <div className="rounded position-relative fruite-item">
                              <div className="fruite-img">
                                <img src="/img/fruite-item-5.jpg" className="img-fluid w-100 rounded-top" alt="" />
                              </div>
                              <div className="text-white bg-secondary px-3 py-1 rounded position-absolute" style={{top: '10px', left: '10px'}}>Fruits</div>
                              <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                                <h4>{product.name}</h4>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
                                <div className="d-flex justify-content-between flex-lg-wrap">
                                  <p className="text-dark fs-5 fw-bold mb-0">${product.price} / kg</p>
                                  <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fruits Shop End */}
    </>
  );
}
