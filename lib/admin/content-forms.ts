import { TEXTS } from '../../hardcoded/texts'

export type ContentKind = 'class' | 'event' | 'workshop' | 'digitalProduct'

export type ContentField =
  | 'title'
  | 'description'
  | 'cover'
  | 'link'
  | 'digitalType'
  | 'eventDate'

export type ContentValues = {
  id?: string
  title?: string
  description?: string | null
  coverUrl?: string | null
  hotmartUrl?: string | null
  type?: 'EBOOK' | 'VIDEO'
  eventDate?: string
}

type FormLabels = {
  title: string
  titlePlaceholder: string
  description: string
  descriptionPlaceholder: string
  link?: string
  linkPlaceholder?: string
  digitalType?: string
  typeEbook?: string
  typeVideo?: string
  eventDate?: string
}

type ContentFormConfig = {
  fields: ContentField[]
  labels: FormLabels
  create: {
    title: string
    description: string
    trigger: string
    submit: string
    pending?: string
    success?: string
  }
  edit: {
    title: string
    description: string
    iconAria: string
    submit: string
    pending?: string
  }
  delete: {
    iconAria: string
    title: string
    description: string
    confirm: string
    cancel: string
    error: string
    pending?: string
  }
  errors: Record<string, string>
}

export const CONTENT_FORMS: Record<ContentKind, ContentFormConfig> = {
  class: {
    fields: ['title', 'description', 'cover'],
    labels: {
      title: TEXTS.AULAS_ADMIN_TITLE_LABEL_1,
      titlePlaceholder: TEXTS.AULAS_ADMIN_TITLE_PLACEHOLDER_1,
      description: TEXTS.AULAS_ADMIN_DESCRIPTION_LABEL_1,
      descriptionPlaceholder: TEXTS.AULAS_ADMIN_DESCRIPTION_PLACEHOLDER_1,
    },
    create: {
      title: TEXTS.AULAS_ADMIN_MODAL_TITLE_1,
      description: TEXTS.AULAS_ADMIN_MODAL_DESCRIPTION_1,
      trigger: TEXTS.AULAS_ADMIN_TRIGGER_1,
      submit: TEXTS.AULAS_ADMIN_SUBMIT_1,
    },
    edit: {
      title: TEXTS.AULAS_EDIT_MODAL_TITLE_1,
      description: TEXTS.AULAS_EDIT_MODAL_DESCRIPTION_1,
      iconAria: TEXTS.AULAS_EDIT_ICON_ARIA_1,
      submit: TEXTS.AULAS_ADMIN_SUBMIT_1,
      pending: TEXTS.AULAS_ADMIN_SAVING_1,
    },
    delete: {
      iconAria: TEXTS.AULAS_DELETE_ICON_ARIA_1,
      title: TEXTS.AULAS_DELETE_TITLE_1,
      description: TEXTS.AULAS_DELETE_DESCRIPTION_1,
      confirm: TEXTS.AULAS_DELETE_CONFIRM_1,
      cancel: TEXTS.AULAS_DELETE_CANCEL_1,
      error: TEXTS.AULAS_DELETE_ERROR_1,
    },
    errors: {
      title: TEXTS.AULAS_ADMIN_ERROR_TITLE_1,
      imageType: TEXTS.AULAS_ADMIN_ERROR_IMAGE_TYPE_1,
      imageSize: TEXTS.AULAS_ADMIN_ERROR_IMAGE_SIZE_1,
      imageData: TEXTS.AULAS_ADMIN_ERROR_IMAGE_DATA_1,
      imageUpload: TEXTS.ADMIN_ERROR_IMAGE_UPLOAD_1,
      persistence: TEXTS.AULAS_ADMIN_ERROR_PERSISTENCE_1,
    },
  },
  event: {
    fields: ['title', 'description', 'eventDate'],
    labels: {
      title: TEXTS.EVENTOS_ADMIN_TITLE_LABEL_1,
      titlePlaceholder: TEXTS.EVENTOS_ADMIN_TITLE_PLACEHOLDER_1,
      description: TEXTS.EVENTOS_ADMIN_DESCRIPTION_LABEL_1,
      descriptionPlaceholder: TEXTS.EVENTOS_ADMIN_DESCRIPTION_PLACEHOLDER_1,
      eventDate: TEXTS.EVENTOS_ADMIN_DATE_LABEL_1,
    },
    create: {
      title: TEXTS.EVENTOS_ADMIN_MODAL_TITLE_1,
      description: TEXTS.EVENTOS_ADMIN_MODAL_DESCRIPTION_1,
      trigger: TEXTS.EVENTOS_ADMIN_TRIGGER_1,
      submit: TEXTS.EVENTOS_ADMIN_SUBMIT_1,
    },
    edit: {
      title: TEXTS.EVENTOS_EDIT_MODAL_TITLE_1,
      description: TEXTS.EVENTOS_EDIT_MODAL_DESCRIPTION_1,
      iconAria: TEXTS.EVENTOS_EDIT_ICON_ARIA_1,
      submit: TEXTS.EVENTOS_EDIT_MODAL_SUBMIT_1,
    },
    delete: {
      iconAria: TEXTS.EVENTOS_DELETE_ICON_ARIA_1,
      title: TEXTS.EVENTOS_DELETE_TITLE_1,
      description: TEXTS.EVENTOS_DELETE_DESCRIPTION_1,
      confirm: TEXTS.EVENTOS_DELETE_CONFIRM_1,
      cancel: TEXTS.EVENTOS_DELETE_CANCEL_1,
      error: TEXTS.EVENTOS_DELETE_ERROR_1,
    },
    errors: {
      title: TEXTS.EVENTOS_ADMIN_ERROR_TITLE_1,
      slug: TEXTS.EVENTOS_ADMIN_ERROR_SLUG_1,
    },
  },
  workshop: {
    fields: ['title', 'description'],
    labels: {
      title: TEXTS.WORKSHOPS_ADMIN_TITLE_LABEL_1,
      titlePlaceholder: TEXTS.WORKSHOPS_ADMIN_TITLE_PLACEHOLDER_1,
      description: TEXTS.WORKSHOPS_ADMIN_DESCRIPTION_LABEL_1,
      descriptionPlaceholder: TEXTS.WORKSHOPS_ADMIN_DESCRIPTION_PLACEHOLDER_1,
    },
    create: {
      title: TEXTS.WORKSHOPS_ADMIN_MODAL_TITLE_1,
      description: TEXTS.WORKSHOPS_ADMIN_MODAL_DESCRIPTION_1,
      trigger: TEXTS.WORKSHOPS_ADMIN_TRIGGER_1,
      submit: TEXTS.WORKSHOPS_ADMIN_SUBMIT_1,
      pending: TEXTS.WORKSHOPS_ADMIN_SUBMIT_PENDING_1,
      success: TEXTS.WORKSHOPS_ADMIN_SUCCESS_1,
    },
    edit: {
      title: TEXTS.WORKSHOPS_EDIT_MODAL_TITLE_1,
      description: TEXTS.WORKSHOPS_EDIT_MODAL_DESCRIPTION_1,
      iconAria: TEXTS.WORKSHOPS_EDIT_ICON_ARIA_1,
      submit: TEXTS.WORKSHOPS_EDIT_SUBMIT_1,
      pending: TEXTS.WORKSHOPS_ADMIN_SUBMIT_PENDING_1,
    },
    delete: {
      iconAria: TEXTS.WORKSHOPS_DELETE_ICON_ARIA_1,
      title: TEXTS.WORKSHOPS_DELETE_TITLE_1,
      description: TEXTS.WORKSHOPS_DELETE_DESCRIPTION_1,
      confirm: TEXTS.WORKSHOPS_DELETE_CONFIRM_1,
      cancel: TEXTS.WORKSHOPS_DELETE_CANCEL_1,
      error: TEXTS.WORKSHOPS_DELETE_ERROR_1,
      pending: TEXTS.WORKSHOPS_DELETE_PENDING_1,
    },
    errors: {
      title: TEXTS.WORKSHOPS_ADMIN_ERROR_TITLE_1,
      create: TEXTS.WORKSHOPS_ADMIN_ERROR_CREATE_1,
      request: TEXTS.WORKSHOPS_ADMIN_ERROR_REQUEST_1,
      network: TEXTS.WORKSHOPS_ADMIN_ERROR_NETWORK_1,
      update: TEXTS.WORKSHOPS_EDIT_ERROR_UPDATE_1,
    },
  },
  digitalProduct: {
    fields: ['title', 'description', 'link', 'digitalType'],
    labels: {
      title: TEXTS.PRODUTOS_DIGITAIS_ADMIN_TITLE_LABEL_1,
      titlePlaceholder: TEXTS.PRODUTOS_DIGITAIS_ADMIN_TITLE_PLACEHOLDER_1,
      description: TEXTS.PRODUTOS_DIGITAIS_ADMIN_DESCRIPTION_LABEL_1,
      descriptionPlaceholder: TEXTS.PRODUTOS_DIGITAIS_ADMIN_DESCRIPTION_PLACEHOLDER_1,
      link: TEXTS.PRODUTOS_DIGITAIS_ADMIN_LINK_LABEL_1,
      linkPlaceholder: TEXTS.PRODUTOS_DIGITAIS_ADMIN_LINK_PLACEHOLDER_1,
      digitalType: TEXTS.PRODUTOS_DIGITAIS_ADMIN_TYPE_LABEL_1,
      typeEbook: TEXTS.PRODUTOS_DIGITAIS_ADMIN_TYPE_EBOOK_1,
      typeVideo: TEXTS.PRODUTOS_DIGITAIS_ADMIN_TYPE_VIDEO_1,
    },
    create: {
      title: TEXTS.PRODUTOS_DIGITAIS_ADMIN_MODAL_TITLE_1,
      description: TEXTS.PRODUTOS_DIGITAIS_ADMIN_MODAL_DESCRIPTION_1,
      trigger: TEXTS.PRODUTOS_DIGITAIS_ADMIN_TRIGGER_1,
      submit: TEXTS.PRODUTOS_DIGITAIS_ADMIN_SUBMIT_1,
    },
    edit: {
      title: TEXTS.PRODUTOS_DIGITAIS_EDIT_MODAL_TITLE_1,
      description: TEXTS.PRODUTOS_DIGITAIS_EDIT_MODAL_DESCRIPTION_1,
      iconAria: TEXTS.PRODUTOS_DIGITAIS_EDIT_ICON_ARIA_1,
      submit: TEXTS.PRODUTOS_DIGITAIS_ADMIN_SUBMIT_1,
    },
    delete: {
      iconAria: TEXTS.PRODUTOS_DIGITAIS_DELETE_ICON_ARIA_1,
      title: TEXTS.PRODUTOS_DIGITAIS_DELETE_TITLE_1,
      description: TEXTS.PRODUTOS_DIGITAIS_DELETE_DESCRIPTION_1,
      confirm: TEXTS.PRODUTOS_DIGITAIS_DELETE_CONFIRM_1,
      cancel: TEXTS.PRODUTOS_DIGITAIS_DELETE_CANCEL_1,
      error: TEXTS.PRODUTOS_DIGITAIS_DELETE_ERROR_1,
    },
    errors: {
      title: TEXTS.PRODUTOS_DIGITAIS_ADMIN_ERROR_TITLE_1,
      type: TEXTS.PRODUTOS_DIGITAIS_ADMIN_ERROR_TYPE_1,
    },
  },
}
