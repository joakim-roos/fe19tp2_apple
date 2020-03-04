import React from 'react';
import styled from 'styled-components';

import deleteCross from './icon_delete_tab.png';
import tabMenuToggle from './icon_tabmenu_toggle.png';

const IconStyled = styled.img`
  width: ${props => props.w || '1.5rem'};
  max-width: ${props => props.maxW || '1.5rem'};
`;

export const icons = {
  deleteCross,
  tabMenuToggle
};

const IconTemplate = props => {
  return (
    <>
      <IconStyled
        src={props.src}
        w={props.w || null}
        maxW={props.maxW || null}
      />
    </>
  );
};

export default IconTemplate;
