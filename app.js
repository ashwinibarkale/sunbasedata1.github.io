$(document).ready(function () {
    let token;

    // Function to perform API authentication
    function authenticateUser(login_id, password) {
        $.ajax({
            url: "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp",
            type: "POST",
            data: JSON.stringify({ login_id: login_id, password: password }),
            contentType: "application/json",
            success: function (data) {
                token = data.token; // Store the bearer token for subsequent API calls
                localStorage.setItem("bearer_token", token);
                loadCustomerList();
            },
            error: function (xhr, status, error) {
                alert("Authentication failed. Please check your credentials.");
            }
        });
    }

    // Function to fetch and display the customer list
    function loadCustomerList() {
        $.ajax({
            url: "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (data) {
                let tableRows = "";
                data.forEach(function (customer) {
                    tableRows += `<tr>
                                    <td>${customer.first_name}</td>
                                    <td>${customer.last_name}</td>
                                    <td>${customer.email}</td>
                                    <td>${customer.phone}</td>
                                    <td>
                                        <button class="delete-btn" onclick="deleteCustomer('${customer.uuid}')">Delete</button>
                                        <button class="edit-btn" onclick="updateCustomer('${customer.uuid}')">Update</button>
                                    </td>
                                </tr>`;
                });
                $("#customerTableBody").html(tableRows);
            },
            error: function (xhr, status, error) {
                alert("Failed to retrieve customer list.");
            }
        });
    }

    // Function to add a new customer
    function addCustomer(customerData) {
        $.ajax({
            url: "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create",
            type: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: JSON.stringify(customerData),
            contentType: "application/json",
            success: function (data) {
                alert("Customer created successfully!");
                window.location.href = "customer_list.html";
            },
            error: function (xhr, status, error) {
                alert("Failed to create customer.");
            }
        });
    }

    // Function to delete a customer
    function deleteCustomer(uuid) {
        $.ajax({
            url: "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=" + uuid,
            type: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (data) {
                alert("Customer deleted successfully!");
                loadCustomerList();
            },
            error: function (xhr, status, error) {
                alert("Failed to delete customer.");
            }
        });
    }

    // Handle form submissions
    $("#loginForm").submit(function (event) {
        event.preventDefault();
        const login_id = $("#login_id").val();
        const password = $("#password").val();
        authenticateUser(login_id, password);
    });

    $("#addCustomerForm").submit(function (event) {
        event.preventDefault();
        const customerData = {
            "first_name": $("#first_name").val(),
            "last_name": $("#last_name").val(),
            "street": $("#address").val(),
            "city": $("#city").val(),
            "state": $("#state").val(),
            "email": $("#email").val(),
            "phone": $("#phone").val()
        };
        addCustomer(customerData);
    });

    // Retrieve the bearer token from localStorage if available
    token = localStorage.getItem("bearer_token");
    if (token) {
        loadCustomerList();
    }
});
