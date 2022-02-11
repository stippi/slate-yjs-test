import React, { CSSProperties, PropsWithChildren, useRef } from 'react';
import { CursorData } from 'types/CustomSlateTypes';
import { Avatar, AvatarGroup } from '@mui/material'
import { Awareness } from 'y-protocols/awareness'

type PresentUsersProps = PropsWithChildren<{
  awareness: Awareness
}>;

type User = {
  id: number
  name: string
  color: string
}

function stringAvatar(user: User) {
  return {
    sx: {
      width: 24,
      height: 24,
      fontSize: 12,
      bgcolor: user.color,
    },
    children: `${user.name.split(' ')[0][0]}${user.name.split(' ')[1][0]}`,
  };
}

export function PresentUsers({ awareness }: PresentUsersProps) {

  const users = otherUsers(awareness)

  return (
    <AvatarGroup max={4}>
      {users.map((user) => (
        user && user.name && <Avatar {...stringAvatar(user)} />
      ))}
    </AvatarGroup>
  );
}

function otherUsers(awareness: Awareness) {
  return Array.from(awareness.getStates().entries(), ([id, state]) => {
      // Ignore invalid states
      if (!state) {
        return null;
      }

      console.log(JSON.stringify(state))

      return {
          id: id,
          name: state['name'] as string,
          color: state['color'] as string,
      }
  })
}
