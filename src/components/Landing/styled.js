import styled from 'styled-components';
import { device } from '../device';


export const Background = styled.div`
width: 100vw;
height: 100vh;
position: absolute;
z-index: -1000;
`;

export const Intro = styled.h1`
font-size: 3rem;
`;

export const Grid = styled.div`
grid-row-start: 3;

@media ${device.mobileS} {
  grid-column-start: 2;
  grid-column-end: 10;
  
}
@media ${device.mobileM} {
  grid-column-start: 2;
  grid-column-end: 10;
  
}
@media ${device.mobileL} {
  grid-column-start: 2;
  grid-column-end: 10;
  
}
@media ${device.tablet} {
  grid-column-start: 2;
  grid-column-end: 10;
  
}
@media ${device.laptop} {
  grid-column-start: 3;
  grid-column-end: 10;
  
}
@media ${device.laptopL} {
  grid-column-start: 3;
  grid-column-end: 10;
  
}
@media ${device.desktop} {
  grid-column-start: 3;
  grid-column-end: 10;
  
}
`;