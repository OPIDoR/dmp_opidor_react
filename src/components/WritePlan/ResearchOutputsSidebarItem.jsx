import React, { useContext, useEffect, useState } from "react";

import { GlobalContext } from "../context/Global";
import { researchOutput } from "../../services";
import { except } from "../../utils/utils";

function ResearchOutputsSidebarItem({ item, setLoading, children }) {
  const {
    setDisplayedResearchOutput,
    setUrlParams,
    setQuestionsWithGuidance,
  } = useContext(GlobalContext);
  const [selectedResearchOutputId, setSelectedResearchOutputId] = useState(null);

  useEffect(() => {
    if (selectedResearchOutputId) {
      setLoading(true);
      researchOutput.get(selectedResearchOutputId).then((res) => {
        // setLoadedSectionsData({ ...loadedSectionsData, [res.data.template.id]: res.data.template});
        setDisplayedResearchOutput(except(res.data, ['questions_with_guidance']));
        setQuestionsWithGuidance(res.data.questions_with_guidance);
      }).finally(() => setLoading(false))
    }
  }, [selectedResearchOutputId])

  /**
   * When the user clicks on a tab, the function sets the active index to the index of the tab that was clicked, and sets the research id to the id of the
   * tab that was clicked.
   */
  const handleShowResearchOutputClick = (e, selectedResearchOutput, index) => {
    e.preventDefault();
    setSelectedResearchOutputId(selectedResearchOutput.id);
    setUrlParams({ research_output: selectedResearchOutput.id });
  };

  return (
    <div onClick={(e) => handleShowResearchOutputClick(e, item, item.id)}>
      {/* {researchOutputs && (
        <Nav style={{width: '100%'}} activeKey={`ro-${displayedResearchOutput.id}`}>
          {researchOutputs.map((ro, idx) => (
            <Nav.Item
              key={idx}
              onClick={(e) => handleShowResearchOutputClick(e, ro, idx)}
            >
              <Nav.Link eventKey={`ro-${ro.id}`} style={{ padding: '20px 0'}}>{ro.abbreviation}</Nav.Link>
            </Nav.Item>
          ))}
          {!readonly && (
            <>{ children }</>
          )}
        </Nav>
      )} */}
      {children}
    </div>
  );
}

export default ResearchOutputsSidebarItem;
