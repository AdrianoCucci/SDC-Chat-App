import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faTimes, faCheck, faTrash, faSignInAlt, faSignOutAlt, faUpload, faDownload, faCloudUploadAlt, faCloudDownloadAlt, faChevronUp, faChevronDown, faChevronLeft, faChevronRight, faUser, faUsers, faUserPlus, faUserEdit, faLock, faKey, faExternalLinkAlt, faEdit, faPen, faSync, faCog, faCogs, faBuilding, faDoorOpen, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const commonIconsMap = new Map<string, IconDefinition>([
  ["plus", faPlus],
  ["times", faTimes],
  ["check", faCheck],
  ["trash", faTrash],
  ["login", faSignInAlt],
  ["logout", faSignOutAlt],
  ["upload", faUpload],
  ["download", faDownload],
  ["cloud-upload", faCloudUploadAlt],
  ["cloud-download", faCloudDownloadAlt],
  ["chevron-up", faChevronUp],
  ["chevron-down", faChevronDown],
  ["chevron-left", faChevronLeft],
  ["chevron-right", faChevronRight],
  ["user", faUser],
  ["users", faUsers],
  ["user-plus", faUserPlus],
  ["user-edit", faUserEdit],
  ["lock", faLock],
  ["key", faKey],
  ["external-link", faExternalLinkAlt],
  ["edit", faEdit],
  ["pen", faPen],
  ["sync", faSync],
  ["cog", faCog],
  ["cogs", faCogs],
  ["building", faBuilding],
  ["door-open", faDoorOpen],
  ["volume-up", faVolumeUp]
]);

export const getCommonFaIcon = (icon: string): IconDefinition => commonIconsMap.get(icon);