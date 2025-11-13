export type Role = {
  id_role: number;
  name_role: string;
  description_role: string;
  skills_role: string;
};

export type Practice = {
  id_practice: number;
  name_practice: string;
  description_practice: string;
};

export type Thinklet = {
  id_thinklet: number;
  name_thinklet: string;
  description_thinklet: string;
  pattern?: CollaborativePattern | null 
};

export type CollaborativePattern = {
  id_pattern: number;
  name_pattern: string;
  description_pattern: string;
};

export type Round = {
  id: number;
  name: string;
  order: number;      
  processId: number;
};


export interface Process {
  id_process: number
  name_process: string
  description_process: string
  version_process?: string
  image?: string
}

export interface CreateProcessData {
  name_process: string
  version_process?: string
  image?: string
}

export type Activity = {
  id_activity: number;
  name_activity: string;
  description_activity: string;
  processId: number;
};

