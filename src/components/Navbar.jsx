import React, { useEffect } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout }) => {
    const navigate = useNavigate();
  
    useEffect(() => {
  
      if (isLoggedIn) {
        // fetchRequestCounts();
      }
    }, [isLoggedIn]);

    return(
        <>
        {isLoggedIn && (
            <MDBNavbar expand="lg" light style={{ backgroundColor: "#1e3869" }}>
              <MDBContainer fluid>
                <MDBNavbarBrand
                  href="#"
                  className="text-white"
                  onClick={() => navigate("/home")}
                >
                  <h3>Storage Optimizer</h3>
                </MDBNavbarBrand>
                <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
                  <MDBNavbarItem className="me-4">
                    <MDBNavbarLink
                      href="#"
                      className="text-white"
                      onClick={() => navigate("/landin-page")}
                    >
                      Statistics
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem className="me-4">
                    <MDBNavbarLink
                      href="#"
                      className="text-white"
                      onClick={() => navigate("/statistics")}
                    >
                      Tier
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem className="me-4">
                    <MDBNavbarLink
                      href="#"
                      className="text-white"
                      onClick={() => navigate("/tier")}
                    >
                      Users
                    </MDBNavbarLink>
                    </MDBNavbarItem>
                  <MDBNavbarItem className="me-4">
                    <MDBNavbarLink
                      href="#"
                      className="text-white"
                      onClick={() => navigate("/users")}
                    >
                      System Prefrences
                    </MDBNavbarLink>
                    </MDBNavbarItem>
                  <MDBNavbarItem className="me-4">
                    <MDBNavbarLink
                      href="#"
                      className="text-white"
                      onClick={() => navigate("/system-prefrences")}
                    >
                      My Account
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                </MDBNavbarNav>
                <MDBNavbarNav className="d-flex justify-content-end">
                  <MDBNavbarItem className='me-4'>
                    {/* <NotificationBell requestCount={requestCount} /> */}
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBBtn color="danger" onClick={handleLogout}>
                      Logout <MDBIcon fas icon="sign-out-alt" />
                    </MDBBtn>
                  </MDBNavbarItem>
                </MDBNavbarNav>
              </MDBContainer>
            </MDBNavbar>
          )}
          </>
    )

}

export default Navbar;