import { useRouter } from '@uirouter/react';
import { useState } from 'react';

import { r2a } from '@/react-tools/react2angular';

import { PageHeader } from '@@/PageHeader';

import * as notifications from '../services/notifications';
import { Environment } from '../environments/types';
import { snapshotEndpoints } from '../environments/environment.service';
import { isEdgeEnvironment } from '../environments/utils';
import { confirmAsync } from '../services/modal.service/confirm';

import { EnvironmentList } from './EnvironmentList';
import { EdgeLoadingSpinner } from './EdgeLoadingSpinner';
import { MotdPanel } from './MotdPanel';
import { LicenseNodePanel } from './LicenseNodePanel';
import { BackupFailedPanel } from './BackupFailedPanel';

export function HomeView() {
  const [connectingToEdgeEndpoint, setConnectingToEdgeEndpoint] =
    useState(false);

  const router = useRouter();
  return (
    <>
      <PageHeader
        reload
        title="首页"
        breadcrumbs={[{ label: '环境' }]}
      />

      {process.env.PORTAINER_EDITION !== 'CE' && <LicenseNodePanel />}

      <MotdPanel />

      {process.env.PORTAINER_EDITION !== 'CE' && <BackupFailedPanel />}

      {connectingToEdgeEndpoint ? (
        <EdgeLoadingSpinner />
      ) : (
        <EnvironmentList
          onClickItem={handleClickItem}
          onRefresh={confirmTriggerSnapshot}
        />
      )}
    </>
  );

  async function confirmTriggerSnapshot() {
    const result = await confirmEndpointSnapshot();
    if (!result) {
      return;
    }
    try {
      await snapshotEndpoints();
      notifications.success('成功', '环境已更新');
      router.stateService.reload();
    } catch (err) {
      notifications.error(
        '失败',
        err as Error,
        '创建环境快照出错'
      );
    }
  }

  function handleClickItem(environment: Environment) {
    if (isEdgeEnvironment(environment.Type)) {
      setConnectingToEdgeEndpoint(true);
    }
  }
}

export const HomeViewAngular = r2a(HomeView, []);

async function confirmEndpointSnapshot() {
  return confirmAsync({
    title: '是否继续?',
    message:
      '触发手动刷新将轮询每个环境以检索其信息，这可能需要一些时间。',
    buttons: {
      confirm: {
        label: '继续',
        className: 'btn-primary',
      },
    },
  });
}
