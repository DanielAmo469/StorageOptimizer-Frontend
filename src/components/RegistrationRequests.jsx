import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBBtn, MDBListGroup, MDBListGroupItem, MDBContainer } from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try{
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/registration-requests', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching regstration requests', error);
                toast.error('Error fetching regstration requests');
            }
        };

        fetchRequests();
    }, []);

    const approveRequest = async (pending_user_id) => {
        try{
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8000/registration-requests/${pending_user_id}/approve-registration/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Refresh the requests list after approving
            setRequests(requests.filter(request => request.request_id !== pending_user_id));
            toast.success('Registration request approved successfully');
            console.log('Approve response:', response.data);
        } catch (error) {
            if(error.response) {
                console.error('Error approving registration request:', error.response.data);
                toast.error(`Error approving registration request`);
            }
        }
    };

    const denyRequest = async (pending_user_id) => {
        try {
          console.log(pending_user_id)
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:8000/registration-requests/${pending_user_id}/deny-registration/`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
      // Refresh the requests list after denying
      setRequests(requests.filter(request => request.request_id !== pending_user_id));
      toast.success('Registration request denied successfully');
      console.log('Deny response:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error denying registration request:', error.response.data);
        toast.error(`Error denying registration request: ${error.response.data.detail}`);
      } else {
        console.error('Error denying registration request:', error.message);
        toast.error('Error denying registration request');
      }
    }
  };

  return (
    <MDBContainer>
        <ToastContainer />
        <h3>Registration Requests</h3>
        {requests.length === 0 ? (
            <p>No friend requests</p>
        ) : (
            <MDBListGroup>
                {requests.map((request, index) => (
                    <MDBListGroupItem key={index} className="d-flex justify-content-between align-items-center">
              <span>{request.username}</span>
              <span>{request.registration_request_description}</span>
              <div>
                <MDBBtn color="success" onClick={() => approveRequest(request.user_id)} className="me-2">
                  Approve
                </MDBBtn>
                <MDBBtn color="danger" onClick={() => denyRequest(request.user_id)}>
                  Deny
                </MDBBtn>
              </div>
            </MDBListGroupItem>
          ))}
        </MDBListGroup>
        )}
    </MDBContainer>
  );

};

export default RegistrationRequests;