export interface CKANResponse<T> {
  help: string;
  success: boolean;
  result: T;
}

export interface Dataset {
  id: string;
  name: string;
  title: string;
  notes?: string;
  type?: string;
  state?: string;
  metadata_modified?: string;
  metadata_created?: string;
  organization?: {
    id: string;
    name: string;
    title: string;
    description: string;
    image_url?: string;
  };
  resources?: Resource[];
  tags?: Tag[];
  license_title?: string;
  license_id?: string;
  maintainer?: string;
  maintainer_email?: string;
  relationships_as_subject?: any[];
  relationships_as_object?: any[];
  extras?: Array<{ key: string; value: any }>;
  [key: string]: any;
}

export interface Resource {
  id: string;
  name: string;
  format: string;
  url: string;
  description?: string;
  metadata_modified?: string;
  last_modified?: string;
  size?: number;
  mimetype?: string;
}

export interface Tag {
  id: string;
  name: string;
  display_name: string;
  vocabulary_id?: string;
}

export interface LinkReport {
  id: string;
  resource_id: string;
  url: string;
  status: string;
  last_check: string;
  is_available: boolean;
  state: string;
  message?: string;
  created_at?: string;
  details?: {
    code?: number;
    reason?: string;
    explanation?: string;
    [key: string]: any;
  };
}

export interface LinkReportSearchResult {
  count: number;
  results: LinkReport[];
}

export interface SearchResult {
  count: number;
  results: Dataset[];
  search_facets?: {
    [key: string]: {
      items: Array<{
        count: number;
        display_name: string;
        name: string;
      }>;
      title: string;
    };
  };
}
