import React from "react";
import { useTranslation } from "react-i18next";
import { fr, enGB } from "date-fns/locale";

import SectionsContent from "../WritePlan/SectionsContent";


const locales = { fr, en: enGB };

function TemplateMapping({locale}) {
  return (
    <div style={{ position: 'relative' }}>
      Coucou
      {/* <SectionsContent></SectionsContent> */}
    </div>
  );
}

export default TemplateMapping;
