import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { useTranslation } from "react-i18next";

import { adminClient } from "../../admin-client";
import { useAlerts } from "../../components/alert/Alerts";
import { GroupPickerDialog } from "../../components/group/GroupPickerDialog";

type MoveDialogProps = {
  source: GroupRepresentation;
  onClose: () => void;
  refresh: () => void;
};

const moveToRoot = async (source: GroupRepresentation) => {
  try {
    await adminClient.groups.create(source);
  } catch (error) {
    if (error.response) {
      throw error;
    }
  }
};

const moveToGroup = async (
  source: GroupRepresentation,
  dest: GroupRepresentation
) => {
  try {
    await adminClient.groups.setOrCreateChild({ id: dest.id! }, source);
  } catch (error: any) {
    if (error.response) {
      throw error;
    }
  }
};

export const MoveDialog = ({ source, onClose, refresh }: MoveDialogProps) => {
  const { t } = useTranslation("groups");
  const { addAlert, addError } = useAlerts();

  const moveGroup = async (group?: GroupRepresentation[]) => {
    try {
      await (group ? moveToGroup(source, group[0]) : moveToRoot(source));
      refresh();
      addAlert(t("moveGroupSuccess"));
    } catch (error) {
      addError("groups:moveGroupError", error);
    }
  };

  return (
    <GroupPickerDialog
      type="selectOne"
      filterGroups={[source]}
      text={{
        title: "groups:moveToGroup",
        ok: "groups:moveHere",
      }}
      onClose={onClose}
      onConfirm={moveGroup}
    />
  );
};
