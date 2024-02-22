import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import bannerImage from '../assets/images/banner.png';

const ContactControlCover = styled.div`
  display: block;
  margin: 0 auto;
  max-width: 100%;
  min-height: 150px;
`;

const Cover = styled.div`
  position: relative;
  overflow: hidden;
  height: 500px;
  width: 100%;
`;

const ContainerContact = styled.div`
  & div[class^="col-"] {
    position: relative;
    min-height: 1px;
    padding-left: 60px;
    padding-right: 60px;
    padding-top: 20px;
  }
`;

const IconLg = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.5rem;
  line-height: 1;
`;

const FeatureBox = styled.div`
  padding: 22px;
  box-shadow: 0 0 30px rgba(31, 45, 61, 0.125);
  margin: 1px 0;
  position: relative;
  z-index: 1;
  border-radius: 10px;
  overflow: hidden;
  transition: ease all 0.35s;
  top: 0;

  & * {
    transition: ease all 0.35s;
  }

  & .icon {
    width: 70px;
    height: 70px;
    line-height: 70px;
    background: var(--rust);
    color: #ffffff;
    text-align: center;
    border-radius: 50%;
    margin-bottom: 22px;
    font-size: 27px;
  }

  & .icon i {
    line-height: 70px;
  }

  & h5 {
    color: var(--dark-blue);
    font-weight: 600;
  }

  & p {
    margin: 0;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: auto;
    right: 0;
    border-radius: 10px;
    width: 0;
    background: var(--dark-blue);
    z-index: -1;
    transition: ease all 0.35s;
  }

  &:hover {
    top: -5px;

    & h5 {
      color: #ffffff;
    }

    & p {
      color: rgba(255, 255, 255, 0.8);
    }

    &:after {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      left: 0;
      right: auto;
    }
  }
`;

const Section = styled.section`
  padding: 0px 0;
  position: relative;
`;

const SectionTitle = styled.div`
  padding-bottom: 5px;

  & h2 {
    font-weight: 700;
    color: var(--dark-blue);
    font-size: 55px;
    margin: 0 0 15px;
    border-left: 5px solid var(--rust);
    padding-left: 15px;
  }
`;

function RoutePage() {
  return (
    <ContainerContact>
      <div className="row decor-default">
        <div className="col-md-12">
          <div className="contact">
            <ContactControlCover>
              <IconLg className="icon icon-folder" data-toggle="tooltip" data-placement="top" data-original-title="Archive" />
              <IconLg className="icon icon-delete" data-toggle="tooltip" data-placement="top" data-original-title="Delete" />
              <IconLg className="icon icon-close" data-toggle="tooltip" data-placement="top" data-original-title="Close" />

              <Cover as="img" src={bannerImage} alt="cover" />
            </ContactControlCover>
            <div className="row">
              <div>
                <Section className="services-section" id="services">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-6">
                        <SectionTitle>
                          <h2>DMP OPIDOR</h2>
                          <p>
                            Est un outil d’aide à la création en ligne de plans de gestion de données (Data Management Plan ou DMP)mis à disposition
                            de l’Enseignement Supérieur et de la Recherche. Il est hébergé et géré par l’Inist-CNRS. Basé sur le code open source
                            DMPRoadmap, il a été adapté aux besoins de la communauté scientifique française.
                          </p>
                        </SectionTitle>
                      </div>
                      <div className="row" style={{ marginTop: '40px' }}>
                        <div className="row">
                          <strong>Url :</strong>
                          <div>
                            <Link href="https://dmp.opidor.fr/" target="_blank" rel="noopener noreferrer">
                              https://dmp.opidor.fr/
                            </Link>
                          </div>
                          <strong>Git :</strong>
                          <div>
                            <Link href="https://github.com/OPIDoR/dmp_opidor_react/tree/standalone" target="_blank" rel="noopener noreferrer">
                              dmp_opidor_react
                            </Link>
                          </div>

                          <strong>Doc:</strong>
                          <div>
                            <Link href="https://github.com/OPIDoR/dmp_opidor_react/tree/standalone" target="_blank" rel="noopener noreferrer">
                              DMP OPIDOR React Documentation
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {/* form box */}
                      <a href="http://vtopidor.intra.inist.fr:3000/form">
                        <div className="col-sm-6 col-lg-4">
                          <FeatureBox>
                            <div className="icon">
                              <i className="fa fa-desktop" />
                            </div>
                            <div className="feature-content">
                              <h5>Form</h5>
                              <p>http://vtopidor.intra.inist.fr:3000/form</p>
                            </div>
                          </FeatureBox>
                        </div>
                      </a>

                      {/* / */}
                      {/* info box */}
                      <a href="http://vtopidor.intra.inist.fr:3000/info" target="_blank" rel="noopener noreferrer">
                        <div className="col-sm-6 col-lg-4">
                          <FeatureBox>
                            <div className="icon">
                              <i className="fa fa-info" />
                            </div>
                            <div className="feature-content">
                              <h5>Informations généraless</h5>
                              <p>http://vtopidor.intra.inist.fr:3000/info</p>
                            </div>
                          </FeatureBox>
                        </div>
                      </a>

                      {/* / */}
                      {/* redaction box */}
                      <a href="http://vtopidor.intra.inist.fr:3000/redaction" target="_blank" rel="noopener noreferrer">
                        <div className="col-sm-6 col-lg-4">
                          <FeatureBox>
                            <div className="icon">
                              <i className="fa fa-edit" />
                            </div>
                            <div className="feature-content">
                              <h5>Rédaction</h5>
                              <p>http://vtopidor.intra.inist.fr:3000/redaction</p>
                            </div>
                          </FeatureBox>
                        </div>
                      </a>

                      {/* / */}
                      {/* redaction box */}
                      <a href="http://vtopidor.intra.inist.fr:3000/ror" target="_blank" rel="noopener noreferrer">
                        <div className="col-sm-6 col-lg-4">
                          <FeatureBox>
                            <div className="icon">
                              <i className="fa fa-comment" />
                            </div>
                            <div className="feature-content">
                              <h5>ROR</h5>
                              <p>http://vtopidor.intra.inist.fr:3000/ror</p>
                            </div>
                          </FeatureBox>
                        </div>
                      </a>

                      {/* / */}
                    </div>
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContainerContact>
  );
}

export default RoutePage;
