import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class MenuBar extends React.Component {
    render() {
        return(
            <Navbar type="dark" theme="dark" expand="md">
        <NavbarBrand href="/">Art Gallery</NavbarBrand>
          <Nav navbar>
          <NavItem>
              <NavLink active href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/search">
                Search
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/analysis" >
                Analysis
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
