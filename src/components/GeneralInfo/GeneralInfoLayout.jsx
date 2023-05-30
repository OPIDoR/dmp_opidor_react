import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Banner from "../Shared/Banner";
import CustomError from "../Shared/CustomError";
import CustomSpinner from "../Shared/CustomSpinner";
import Footer from "../Shared/Footer";
import Header from "../Shared/Header";
import Navbar from "../Shared/Navbar";
import { Panel, PanelGroup } from "react-bootstrap";
import styles from "../assets/css/info.module.css";
import { TfiAngleDown } from "react-icons/tfi";
import { TfiAngleUp } from "react-icons/tfi";
import Select from "react-select";
import styled from "styled-components";
import { useEffect } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { getFundedProject, getFundingOrganization, saveFunder } from "../../services/DmpGeneralInfoApi";
import Form from "../Forms/Form";

export const ButtonSave = styled.button`
  margin: 10px 2px 2px 0px;
  color: #000;
  font-size: 18px;
  color: var(--primary) !important;
  font-family: custumHelveticaLight !important;
  border-radius: 8px !important;
`;

function GeneralInfoLayout() {
  const { t, i18n } = useTranslation();
  const [lng] = useState(i18n.language.split("-")[0]);
  const [dataFundingOrganization, setDataFundingOrganization] = useState([]);
  const [fundedProject, setFundedProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpenFunder, setIsOpenFunder] = useState(false);
  const [isOpenProject, setIsOpenProject] = useState(true);
  const [isOpenPlan, setIsOpenPlan] = useState(true);
  const [grantId, setGrantId] = useState(null);
  const [projectFragmentId, setProjectFragmentId] = useState("1");

  /* This `useEffect` hook is fetching data for funding organizations and setting the options for a `Select` component. It runs only once when the
component mounts, as the dependency array `[]` is empty. */
  useEffect(() => {
    getFundingOrganization().then((res) => {
      const options = res.data.map((option) => ({
        value: option.id,
        label: option.name,
      }));
      setDataFundingOrganization(options);
    });
  }, []);
  /* This `useEffect` hook is fetching data for funded projects and setting the options for a `Select` component. It runs only once when the component
mounts, as the dependency array `[]` is empty. It sets the loading state to `true` before making the API call, and then sets it to `false` after the
API call is completed, regardless of whether it was successful or not. If there is an error during the API call, it sets the error state to the error
object. */
  useEffect(() => {
    setLoading(true);
    getFundedProject()
      .then((res) => {
        const options = res.data["ANRProjects"].map((option) => ({
          value: option.value,
          label: lng === "fr" ? option?.label?.fr_FR : option?.label?.en_GB,
        }));
        setFundedProject(options);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  /**
   * The function logs the value of an event and sets a grant ID to "ProjectStandard".
   */
  const handleChangeFunder = (e) => {
    console.log(e.value);
    //setGrantId("ProjectStandard");
  };

  /**
   * The function `handleSaveFunder` saves a funder for a project fragment and sets the grant ID to "ProjectStandard".
   */
  const handleSaveFunder = () => {
    saveFunder(grantId, projectFragmentId).then((res) => {
      console.log(res);
      setGrantId("ProjectStandard");
    });
  };

  return (
    <>
      <Header></Header>
      <Banner></Banner>
      <Navbar></Navbar>
      {loading && <CustomSpinner></CustomSpinner>}
      {!loading && error && <CustomError></CustomError>}
      {!loading && !error && dataFundingOrganization && (
        <div className="container">
          <PanelGroup accordion id="accordion-example" className={styles.panel} onClick={() => setIsOpenFunder(!isOpenFunder)} defaultActiveKey="1">
            <Panel
              eventKey={"1"}
              style={{
                border: "2px solid var(--primary)",
                borderRadius: "11px",
                boxShadow: "10px 12px 8px #e5e4e7",
              }}
            >
              <Panel.Heading style={{ background: "var(--primary)", borderRadius: "8px 8px 0px 0px" }}>
                <Panel.Title toggle>
                  <div className={styles.question_title}>
                    <div className={styles.question_text}>
                      <div className={styles.title_anr}>{t("Click here if you have a funded project")}</div>
                    </div>

                    <span className={styles.question_icons}>
                      {/* 3 */}
                      {isOpenFunder ? (
                        <TfiAngleDown style={{ minWidth: "35px" }} size={35} className={styles.down_icon_anr} onClick={(e) => {}} />
                      ) : (
                        <TfiAngleUp style={{ minWidth: "35px" }} size={35} className={styles.down_icon_anr} onClick={(e) => {}} />
                      )}
                    </span>
                  </div>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible style={{ background: "var(--primary)", borderRadius: "0px 0px 8px 8px" }}>
                <div className={styles.container_anr}>
                  <p className={styles.description_anr}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi erat tellus, pharetra sed ipsum ac, ornare lacinia leo. Curabitur
                    rutrum commodo nibh eget ultricies. Aliquam viverra consequat nulla ac vehicula. Etiam porta scelerisque massa in faucibus. Donec
                    ac porta tellus. Praesent pulvinar tristique metus vulputate interdum.
                  </p>
                  <div className="form-group">
                    <div className={styles.label_form_anr}>
                      <label className={styles.label_anr}>{t("Please select your funding organization")}</label>
                    </div>
                    {[] && (
                      <Select
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }),
                          singleValue: (base) => ({ ...base, color: "var(--primary)" }),
                          control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)" }),
                        }}
                        options={dataFundingOrganization}
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <div className={styles.label_form_anr}>
                      <label className={styles.label_anr}>{t("Select project acronym, title or ID")}</label>
                      <BiInfoCircle size={25} color="white" style={{ marginLeft: "10px" }}></BiInfoCircle>
                    </div>
                    {[] && (
                      <Select
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999, color: "grey" }),
                          singleValue: (base) => ({ ...base, color: "var(--primary)" }),
                          control: (base) => ({ ...base, borderRadius: "8px", borderWidth: "1px", borderColor: "var(--primary)" }),
                        }}
                        options={fundedProject}
                        style={{ color: "red" }}
                        onChange={(e) => handleChangeFunder(e)}
                      />
                    )}
                  </div>
                  <ButtonSave className="btn btn-light" onClick={handleSaveFunder}>
                    {t("Save")}
                  </ButtonSave>
                </div>
              </Panel.Body>
            </Panel>
          </PanelGroup>
          <PanelGroup accordion id="accordion-example" className={styles.panel} onClick={() => setIsOpenProject(!isOpenProject)}>
            <Panel eventKey={"2"} style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}>
              <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
                <Panel.Title toggle>
                  <div className={styles.question_title}>
                    <div className={styles.question_text}>
                      <div className={styles.title}>{t("Project Information")}</div>
                    </div>

                    <span className={styles.question_icons}>
                      {/* 3 */}

                      {isOpenProject ? (
                        <TfiAngleDown style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                      ) : (
                        <TfiAngleUp style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                      )}
                    </span>
                  </div>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible={true}>{grantId && <Form schemaId={grantId}></Form>}</Panel.Body>
            </Panel>
          </PanelGroup>
          <PanelGroup accordion id="accordion-example" className={styles.panel} onClick={() => setIsOpenPlan(!isOpenPlan)}>
            <Panel eventKey={"3"} style={{ borderRadius: "10px", borderWidth: "2px", borderColor: "var(--primary)" }}>
              <Panel.Heading style={{ background: "white", borderRadius: "18px" }}>
                <Panel.Title toggle>
                  <div className={styles.question_title}>
                    <div className={styles.question_text}>
                      <div className={styles.title}>{t("Plan Information")}</div>
                    </div>

                    <span className={styles.question_icons}>
                      {/* 3 */}
                      {isOpenPlan ? (
                        <TfiAngleDown style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                      ) : (
                        <TfiAngleUp style={{ minWidth: "35px" }} size={35} className={styles.down_icon} />
                      )}
                    </span>
                  </div>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible={true}>{projectFragmentId && <Form schemaId={"MetaStandard"}></Form>}</Panel.Body>
            </Panel>
          </PanelGroup>
        </div>
      )}
      <Footer></Footer>
    </>
  );
}

export default GeneralInfoLayout;
