import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { service } from "../../services";
import CustomButton from "../Styled/CustomButton";
import ContributorsList from "./ContributorsList";
import ModalForm from "../Forms/ModalForm";
import { useContext } from "react";
import { GlobalContext } from "../context/Global";
import Swal from "sweetalert2";


function ContributorsTab({ planId, locale, readonly }) {
  const { t, i18n } = useTranslation();
  const { setLocale } = useContext(GlobalContext);
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(null);
  const [template, setTemplate] = useState({});
  const [templateId, setTemplateId] = useState(null);
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
      setTemplateId(res.data.template_id);
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
        }).catch((error) => {
          setError(error);
        }).finally(() => {
          handleClose();
        });
    } else {
      service.createFragment(data, templateId, planId)
        .then((res) => {
          newContributorsList.unshift({
            fragmentId: res.data.fragment.id,
            data: res.data.fragment,
            roles: []
          })
        }).catch((error) => {
          setError(error);
        }).finally(() => {
          handleClose();
        });

    }
    setLoading(false);
    setContributors(newContributorsList);
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

    Swal.fire({
      title: t("Are you sure ?"),
      text: t("Are you sure you want to delete this item?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: t("Close"),
      confirmButtonText: t("Yes, delete!"),
    }).then((result) => {
      if (result.isConfirmed) {
        service.destroyFragment(fragmentId).then(() =>{
          newContributorsList.splice(idx, 1);
          setContributors(newContributorsList);
        }).catch(() => {
          Swal.fire({
            title: t("Deleted!"),
            message: t("A problem has occurred while updating the comments"),
            icon: 'error',
          });
        })
      }
    });
  }

  return (
    <>
      <ContributorsList
        contributors={contributors}
        template={template}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
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
      />
      {!readonly && (
        <CustomButton
          handleClick={() => {
            setShow(true);
            setIndex(null);
          }}
          title={t("Add a person")}
          buttonType="primary"
          position="start"
        ></CustomButton>
      )}
    </>
  )
}

export default ContributorsTab;
