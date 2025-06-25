import styled from "styled-components"


  const StyledContainer = styled.div`
    background-color: var(--light-purple);
    width: 50%;
  
  `


export default function ContentContainer({children}:any){
  return( <StyledContainer>{children}</StyledContainer> )
}