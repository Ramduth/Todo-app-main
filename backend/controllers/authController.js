const userschema = require("../models/User");

let adduser = (req, res) => {
    userschema.findOne({ email: req.body.email })
        .then((existingUser) => {
            if (existingUser) {
                // If user exists, return a 400 status with a specific error message
                return res.status(400).json({
                    status: 400,
                    msg: "Email is already registered"
                });
            } else {
                // If user does not exist, create a new user
                let user = new userschema({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: req.body.password
                });

                return user.save()
                    .then((result) => {
                        res.json({
                            status: 200,
                            msg: "User registered successfully"
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            status: 500,
                            err: "An error occurred while saving the user"
                        });
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                status: 500,
                err: "An error occurred while checking for existing user"
            });
        });
};

// Login
let login = (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            msg: "Email and password are required"
        });
    }

    userschema.findOne({ email })
        .then((data) => {
            if (!data) {
                // Return a 404 status if the user is not found
                return res.status(404).json({
                    status: 404,
                    msg: "Email not found"
                });
            } else if (data.password !== password) {
                // Return a 401 status for password mismatch
                return res.status(401).json({
                    status: 401,
                    msg: "Password Mismatch !!"
                });
            } else {
                // Successful login
                return res.status(200).json({
                    data: data,
                    status: 200,
                    msg: "Login successfully"
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                status: 500,
                msg: "Something went wrong"
            });
        });
};

module.exports = { adduser, login };
