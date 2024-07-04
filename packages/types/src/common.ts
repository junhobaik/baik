// packages/types/src/common.ts

export type DataTypes = 'bookmarkGroup' | 'feed' | 'session';

export interface DefaultDBAttributes {
  id: string;
  data_type: DataTypes;
  created_at: number;
  updated_at: number;
}

export type ActionResult = {
  data?: Record<string, any>;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
};
