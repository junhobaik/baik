import React from 'react';

import { BookmarkGroup } from '@baik/types';
import { type Session } from 'next-auth';

interface DashboardScreenProps {
  session: Session | null;
  bookmarkGroupList: BookmarkGroup[];
}

const DashboardScreen = (props: DashboardScreenProps) => {
  return <div>DashboardScreen</div>;
};

export default DashboardScreen;
