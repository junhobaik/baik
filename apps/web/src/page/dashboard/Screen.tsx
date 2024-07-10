import React from 'react';

import { BookmarkGroup } from '@baik/types';
import { Session } from 'next-auth';

interface DashboardScreenProps {
  session: Session;
  bookmarkGroupList: BookmarkGroup[];
}

const DashboardScreen = (props: DashboardScreenProps) => {
  return <div>DashboardScreen</div>;
};

export default DashboardScreen;
