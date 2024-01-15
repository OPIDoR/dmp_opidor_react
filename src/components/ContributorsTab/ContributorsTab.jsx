import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { service } from "../../services";
import CustomButton from "../Styled/CustomButton";
import ContributorsList from "./ContributorsList";
import ModalForm from "../Forms/ModalForm";
import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import Swal from "sweetalert2";
import swalUtils from "../../utils/swalUtils";
import CustomSpinner from "../Shared/CustomSpinner";


function ContributorsTab({ planId, locale, readonly }) {
  const { t, i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [fragmentId, setFragmentId] = useState(null)
  const [editedPerson, setEditedPerson] = useState({})
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    service.getContributors(planId).then((res) => {
      setContributors(res.data.contributors);
      setTemplate(res.data.template);
    })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [planId]);

  useEffect(() => {
    setLocale(locale);
    i18n.changeLanguage(locale.substring(0, 2));
  }, [planId, locale])

  const handleSave = async (data) => {
    const newContributorsList = [...contributors];
    setLoading(true);
    if (index !== null && fragmentId) {
      await service.saveForm(fragmentId, data)
        .then((res) => {
          newContributorsList[index].data = res.data.fragment;
          setContributors(newContributorsList);
        }).catch((error) => {
          setError(error);
        }).finally(() => {
          handleClose();
          setLoading(false);
        });
    } else {
      service.createFragment(data, template.id, planId)
        .then((res) => {
          newContributorsList.unshift({
            id: res.data.fragment.id,
            data: res.data.fragment,
            roles: []
          })
          setContributors(newContributorsList);
        }).catch((error) => {
          setError(error);
        }).finally(() => {
          handleClose();
          setLoading(false);
        });
    }
  };

  const handleClose = () => {
    setShow(false);
    setIndex(null);
    setEditedPerson({})
    setFragmentId(null)
  };

  const handleEdit = (idx) => {
    setIndex(idx);
    setEditedPerson(contributors[idx].data);
    setFragmentId(contributors[idx].id);
    setShow(true);
  }

  const handleDelete = (idx) => {
    const fragmentId = contributors[idx].id;
    const newContributorsList = [...contributors];

    Swal.fire(swalUtils.defaultConfirmConfig(t)).then((result) => {
      if (result.isConfirmed) {
        service.destroyContributor(fragmentId).then(() => {
          newContributorsList.splice(idx, 1);
          setContributors(newContributorsList);
        }).catch(() => {
          Swal.fire(swalUtils.defaultDeleteErrorConfig(t, 'contributor'));
        })
      }
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      {loading && <CustomSpinner isOverlay={true} />}
      <ContributorsList
        contributors={contributors}
        template={template}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {template && show && (
        <ModalForm
          fragmentId={fragmentId}
          data={editedPerson}
          template={template}
          label={t('Editing a person')}
          readonly={readonly}
          show={show}
          handleSave={handleSave}
          handleClose={handleClose}
          withImport={true}
        />)}
      {!readonly && (
        <CustomButton
          handleClick={() => {
            setShow(true);
            setIndex(null);
          }}
          title={t("Add a person")}
          buttonColor="rust"
          position="start"
        ></CustomButton>
      )}
    </div>
  )
}

export default ContributorsTab;
