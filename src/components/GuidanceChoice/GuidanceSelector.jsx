import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Row from 'react-bootstrap/Row';
import { FaXmark } from 'react-icons/fa6';
import { TfiAngleDown, TfiAngleUp } from 'react-icons/tfi';
import { TbBulbFilled } from 'react-icons/tb';
import { useTranslation, Trans } from 'react-i18next';
import toast from 'react-hot-toast';
import { GUIDANCES_GROUPS_LIMIT } from '../../config.js';
import { GlobalContext } from '../context/Global.jsx';
import { guidances } from '../../services/index.js';
import { CustomSpinner, CustomError, CustomSelect } from '../Shared/index.jsx';
import CustomButton from '../Styled/CustomButton.jsx';
import GuidanceGroupItem from './GuidanceGroupItem.jsx';
import OrgWithGuidanceGroups from './OrgWithGuidanceGroups.jsx';

import * as guidanceChoiceStyles from '../assets/css/guidance_choice.module.css';
import * as formStyles from '../assets/css/form.module.css';

const description = {
  fontFamily: '"Helvetica Neue", sans-serif',
  color: 'var(--blue)',
  fontSize: '16px',
  margin: '10px',
};

function GuidanceSelector({
  planId,
  researchOutputId,
  context = 'research_output',
}) {
  const { t } = useTranslation();
  const {
    savedGuidances, setSavedGuidances,
  } = useContext(GlobalContext);
  const [guidancesData, setGuidancesData] = useState([]);
  const [filteredGuidancesData, setFilteredGuidancesData] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGuidancesIds, setSelectedGuidancesIds] = useState([]);
  const guidancesRef = useRef(null);

  const savedGuidancesIds = savedGuidances.map((g) => g.id);

  /**
   * Fetches recommendations and updates state variables.
   */
  useEffect(() => {
    const fetchGuidanceGroups = context === 'plan' ? guidances.getPlanGuidanceGroups(planId) : guidances.getResearchOutputGuidanceGroups(researchOutputId);

    setLoading(true);
    fetchGuidanceGroups
      .then((res) => {
        const { data } = res.data;
        const savedGuidances = formatSelectedGuidances(data, 'init');
        setSavedGuidances(savedGuidances);
        setSelectedGuidancesIds(data.flatMap((org) => org.guidance_groups.filter((group) => group.selected).map((group) => group.id)));
        setGuidancesData(data);
      })
      .catch((error) => { setError(error); })
      .finally(() => setLoading(false));
  }, [planId, researchOutputId]);

  useEffect(() => {
    if (guidancesData.length === 0) return;
    let filtered = [...guidancesData];
    if (context === 'research_output') {
      if (selectedOrg !== null) {
        filtered = filtered.filter((group) => group.name === selectedOrg);
      }
    }
    setFilteredGuidancesData(filtered);
  }, [guidancesData, selectedOrg]);

  const formatSelectedGuidances = (guidanceData, action) => guidanceData.flatMap((org) => org.guidance_groups
    .filter((group) => {
      if (action === 'init') return group.selected;
      if (action === 'select') return selectedGuidancesIds.includes(group.id);
      return group;
    })
    .map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      orgName: org.name,
    })));

  const handleSelectGuidances = (guidance_group_ids, action) => {
    guidance_group_ids = Array.isArray(guidance_group_ids) ? guidance_group_ids : [guidance_group_ids];
    if (action === 'add') {
      setSelectedGuidancesIds([...new Set([...selectedGuidancesIds, ...guidance_group_ids])]);
    } else if (action === 'remove') {
      setSelectedGuidancesIds(selectedGuidancesIds.filter((gid) => !guidance_group_ids.includes(gid)));
    }
  };

  /**
   * The function handles saving a choice and reloading a component in a JavaScript React application.
   */
  const handleSaveChoice = async () => {
    if (selectedGuidancesIds.length <= 0) {
      return toast.error(t('selectAtLeastOne'));
    }

    let response;
    try {
      const postGuidanceGroups = context === 'plan'
        ? guidances.postPlanGuidanceGroups({ guidance_group_ids: selectedGuidancesIds, ro_id: researchOutputId }, planId)
        : guidances.postResearchOutputGuidanceGroups({ guidance_group_ids: selectedGuidancesIds }, researchOutputId);
      response = await postGuidanceGroups;
    } catch (error) {
      console.log(error);
      return toast.error(t('errorSavingSelectedGuidances'));
    }

    const { guidance_groups } = response.data;

    const savedGuidances = formatSelectedGuidances(guidance_groups, 'init');
    setSavedGuidances(savedGuidances);
    setSelectedGuidancesIds(savedGuidances.map((sg) => sg.id));
    setGuidancesData(guidance_groups);
    guidancesRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setSelectedOrg(null);

    toast.success(t('registrationSuccess'));
  };

  const limitHasBeenReached = () => selectedGuidancesIds.length > GUIDANCES_GROUPS_LIMIT;

  const shouldGuidanceGroupDisplay = (guidanceGroup) => {
    if (selectedGuidancesIds.includes(guidanceGroup.id)) return false;
    return true;
  };

  if (guidancesData?.length === 0) {
    return (
      <div style={{
        width: '100%',
        border: '1px solid #cccccc',
        borderRadius: '4px',
        margin: '0 10px 0 10px',
        color: '#212529',
        backgroundColor: '#e9ecef',
        fontSize: '24px',
        textAlign: 'center',
        padding: '10px',
        cursor: 'not-allowed',
      }}>
        {t('noGuidancesAvailable')}
      </div>
    );
  }

  return (
    <Card
      id="accordion-guidance-choice"
      className={guidanceChoiceStyles.card}
      style={{
        border: '2px solid var(--dark-blue)',
        borderRadius: '10px',
      }}>
      <Card.Header style={{ background: 'var(--dark-blue)', borderRadius: isOpen ? '5px 5px 0 0' : '5px' }}>
        <Button
          style={{
            backgroundColor: 'var(--dark-blue)', width: '100%', border: 'none', margin: '0',
          }}
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="guidance-choice-collapse"
          aria-expanded={isOpen}
        >
          <Card.Title style={{ margin: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                flexGrow: 3, fontSize: '24px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TbBulbFilled
                  fill={'var(--rust)'}
                  size={38}
                  style={{ marginRight: '10px', color: 'var(--rust)' }}
                />
                <span style={{ color: 'var(--white)', marginTop: '3px' }}>{
                  context === 'plan' ? t('selectGuidancePlan') : t('selectGuidanceOutput')
                }</span>
              </div>
              <div style={{ width: '30px', marginTop: '8px' }}>
                {isOpen ? (
                  <TfiAngleUp size={24} fill={'var(--white)'} />
                ) : (
                  <TfiAngleDown size={24} fill={'var(--white)'} />
                )}
              </div>
            </div>
          </Card.Title>
        </Button>
      </Card.Header>
      <Collapse in={isOpen}>
        <div id="guidance-choice-collapse">
          <Card.Body>
            <div style={description}>
              <div style={{ textAlign: 'justify' }}>
                <Trans
                  i18nKey="guidanceListInfo"
                  components={{ br: <br />, bold: <strong /> }}
                />
              </div>
              {!loading && !error && guidancesData && context === 'research_output' && (
                <div className="row" style={{ padding: '10px' }}>
                  <div className="col-md-12" style={{ padding: '10px 0', color: 'var(--rust)' }}>
                    {t('filterAvailableGuidances')}
                  </div>
                  <div className={`col-md-7 ${formStyles.select_wrapper}`} style={{ alignContent: 'center' }}>
                    <CustomSelect
                      onSelectChange={(o) => setSelectedOrg(o.value)}
                      options={guidancesData.map((group) => ({ label: group.name, value: group.name }))}
                      selectedOption={selectedOrg ? { label: selectedOrg, value: selectedOrg } : null}
                      name="guidanceOrg"
                      placeholder={t('selectAnOrganisation')}
                    />
                  </div>
                  <div className="col-md-1" style={{ alignContent: 'center' }}>
                    <FaXmark
                      onClick={() => setSelectedOrg(null)}
                      className={formStyles.icon}
                    />
                  </div>
                </div>
              )}
              {loading && <CustomSpinner />}
              {!loading && error && <CustomError error={error} />}
              {!loading && !error && (
                <Row ref={guidancesRef}>
                  <Card className="available-guidances" style={{ flex: '1', marginRight: '5px' }}>
                    <Card.Title className={guidanceChoiceStyles.card_title}>{t('availableGuidances')}</Card.Title>
                    <Card.Body style={{ maxHeight: '500px', overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'var(--rust) lightgray', borderTop: '1px solid lightgray' }}>
                      {filteredGuidancesData.length > 0
                        ? filteredGuidancesData.map((org, index) => (
                          org.guidance_groups.length > 1 ? (
                            <OrgWithGuidanceGroups
                              key={index}
                              org={org}
                              isLimitReached={limitHasBeenReached()}
                              shouldGuidanceGroupDisplay={shouldGuidanceGroupDisplay}
                              onSelect={(guidance_group_id) => handleSelectGuidances(guidance_group_id, 'add')}
                            />
                          ) : (
                            shouldGuidanceGroupDisplay(org.guidance_groups[0])
                            && <GuidanceGroupItem
                              key={index}
                              guidance_group_id={org.guidance_groups[0].id}
                              guidance_group_name={org.name}
                              guidance_group_description={org.guidance_groups[0].description}
                              org={org}
                              level={1}
                              isLimitReached={limitHasBeenReached()}
                              onSelect={(guidance_group_id) => handleSelectGuidances(guidance_group_id, 'add')}
                            />
                          )
                        )) : t('noGuidancesAvailable')
                      }
                    </Card.Body>
                  </Card>
                  <Card className="selected-guidances" style={{ flex: '1', marginLeft: '5px' }}>
                    <Card.Title className={guidanceChoiceStyles.card_title}>{t('selectedGuidances')}</Card.Title>
                    <Card.Body style={{ borderTop: '1px solid lightgray' }}>
                      {guidancesData.length > 0
                        ? guidancesData.map((org, index) => (
                          org.guidance_groups.length > 1 ? (
                            <OrgWithGuidanceGroups
                              key={index}
                              org={org}
                              isLimitReached={false}
                              shouldGuidanceGroupDisplay={(guidance_group) => selectedGuidancesIds.includes(guidance_group.id)}
                              getStatus={(guidance_group_id) => (savedGuidancesIds.includes(guidance_group_id) ? 'saved' : 'new')}
                              onSelect={(guidance_group_id) => handleSelectGuidances(guidance_group_id, 'remove')}
                            />
                          ) : (
                            selectedGuidancesIds.includes(org.guidance_groups[0].id)
                            && <GuidanceGroupItem
                              key={index}
                              guidance_group_id={org.guidance_groups[0].id}
                              guidance_group_name={org.name}
                              guidance_group_description={org.guidance_groups[0].description}
                              org={org}
                              level={1}
                              isLimitReached={false}
                              status={savedGuidancesIds.includes(org.guidance_groups[0].id) ? 'saved' : 'new'}
                              onSelect={(guidance_group_id) => handleSelectGuidances(guidance_group_id, 'remove')}
                            />
                          )
                        )) : t('noGuidancesSelected')
                      }
                    </Card.Body>
                  </Card>
                </Row>
              )}

              <div style={{ width: '50%', float: 'right', padding: '5px', display: 'flex', justifyContent: 'space-between' }}>
                {!loading && !error && guidancesData && (
                  <>
                    <CustomButton
                      title={
                        limitHasBeenReached() ? t('guidanceLimitReached', { limit: GUIDANCES_GROUPS_LIMIT }) : t('save')
                      }
                      buttonColor={selectedGuidancesIds.length > 0 ? 'rust' : 'blue'}
                      position="start"
                      handleClick={limitHasBeenReached() ? null : handleSaveChoice}
                      disabled={limitHasBeenReached()}
                    />
                    <CustomButton
                      title={t('reinit')}
                      buttonColor='blue'
                      position="end"
                      handleClick={() => setSelectedGuidancesIds(savedGuidancesIds)}
                      disabled={JSON.stringify(savedGuidancesIds.sort()) === JSON.stringify(selectedGuidancesIds.sort())}
                    />
                  </>
                )}
              </div>
            </div >
          </Card.Body >
        </div >
      </Collapse >
    </Card >
  );
}

export default GuidanceSelector;
