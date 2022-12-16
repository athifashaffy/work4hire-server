const logger = require('../utils/logger');
const User = require('../models/user');
const admin = require("firebase-admin");
const firebase = require("firebase");
const serviceAccount = require("./work4hire-8a56a-firebase-adminsdk-mt8sw-4aa7a2ff05");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://go-first-mvp-dev.firebaseio.com",
  // storageBucket: process.env.STORAGE_BUCKET,
  // apiKey: "AIzaSyB3NAEFWuXtyP7iGvxJCz8Bs7TA7EGFo7E",
  // authDomain: "work4hire-8a56a.firebaseapp.com",
  // projectId: "work4hire-8a56a",
  storageBucket: "work4hire-8a56a.appspot.com",
  // messagingSenderId: "558258678885",
  // appId: "1:558258678885:web:631d004ff980d0c005aa8c"
});


// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// import { parse } from 'node-html-parser';
// const parse = require('node-html-parser');

const viewableAttributes = [
  'id',
  'uid',
  'lat',
  'lag',
  'location',
  'postcode',
  'isDefault',
  'city',
  'type',
];

exports.createUser = async (req, res) => {
  // Make a copy of the new account
  let accountData = { ...req.body };
  const {email, password, firstName,lastName,address,image} = req.body;
  console.log("test",email,password);
  try {
    const auth = admin.auth();
    console.log("auth");
    auth.createUser({
      email,
      password
    })
      .then((user) => {
        console.log("user", user);
        const db = admin.firestore();
        let userRecord = {
            firstName,
            lastName,
            email,
            address,
            image,
            status: 1,
            createdDate: Date.now(),
            editedDate: Date.now()
        };
        db.collection("users").doc(email).set(userRecord)
        .then(() => {
            console.log("Document successfully written!");
            return res.status(200).json(userRecord);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });


      })
      .catch((error) => {
        console.log("error", error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });

  } catch (err) {
    logger.error({
      message: 'Error on account.controller (createAccount):',
      error: err,
    });

    return res.status(500).json({ err, message: err.toString() });
  }
};



exports.Login = async (request, response) => {
    try {
    console.log("Login");
    const { email, password } = request.body;
    const db = admin.firestore();
    db.collection("users").doc(email).get()
    .then((doc) => {
      let userDetails;
        if (doc.exists) {
          userDetails = doc.data();
          console.log("Document data:", userDetails);
        }
        console.log("user data", userDetails);
        return response.status(200).json({ success: true, user: userDetails });
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        return response.status(500).json({ error, message: error.toString() });
    });

  } catch (error) {
    console.log(error);
    return response.status(500).json({ error, message: error.toString() });
  }
};

// exports.getUsers = async (req, res) => {
//   // Query Variable
//   const query = req.query;

//   // Find by Email
//   try {
//     if (query.email) {
//       const account = await Account.findOne({
//         where: {
//           account_email: query.email,
//         },
//       });

//       if (account) return res.status(200).json(account.get({ plain: true }));
//     }

//     return res.status(404).json({ error: 'data not found' });
//   } catch (err) {
//     logger.error({
//       message: 'Error on account.controller (readAccounts):',
//       error: err,
//     });
//     return res.status(500).json({ err, message: err.toString() });
//   }
// };

// exports.updateUser = async (req, res) => {
//   // Params
//   const id = req.params.id;

//   // Data to update
//   const data = req.body;

//   try {
//     // If password need to be update it
//     if (data.password) {
//       const saltRound = 10;
//       // Hash password
//       let hashedPassword = await bcrypt.hash(data.password, saltRound);

//       // Add the hashed password
//       data.password = hashedPassword;
//     }

//     // Update user
//     const updatedRows = await Account.update(
//       { ...data },
//       {
//         where: {
//           id: id,
//         },
//       }
//     );
//     // Get updated user
//     const updatedAccount = await Account.findOne({
//       where: {
//         id: id,
//       },
//     });

//     if (updatedAccount) {
//       // Send the user to client
//       return res.status(200).json({
//         updatedRows: updatedRows[0],
//         account: updatedAccount.get({ plain: true }),
//       });
//     }

//     res.status(404).json({ error: 'data not found' });
//   } catch (err) {
//     logger.error({
//       message: 'Error on account.controller (updateAccount):',
//       error: err,
//     });
//     // Validation Error
//     if (err.name === 'SequelizeValidationError') {
//       return res.status(400).json({
//         error: 'Validation Error',
//         message: err.errors.map((error) => error.message),
//       });
//     }
//     return res.status(500).json({ err, message: err.toString() });
//   }
// };

exports.updateUserFb = async (req, res) => {
  const { email, firstName, lastName, image } = req.body;
  const db = admin.firestore();
  let userRecord = {
      firstName,
      lastName,
      image,
      status: 1,
      editedDate: Date.now()
  };

  db.collection("users").doc(email).set(userRecord)
  .then(() => {
    return response.status(200).json({ success: true });
  })
}

// exports.deleteUser = async (req, res) => {
//   // Params
//   const id = req.params.id;
//   try {
//     const params = {
//       where: {
//         id: id,
//       },
//     };

//     // Fetch record and then delete
//     const deletedAccount = await Account.findOne(params);

//     if (deletedAccount) {
//       const destroyVar = await Account.destroy(params);
//       return res.status(200).json({
//         deleted: destroyVar ? true : false,
//         deletedAccount: deletedAccount.get({ plain: true }),
//       });
//     }

//     res.status(404).json({ error: 'data not found' });
//   } catch (err) {
//     logger.error({
//       message: 'Error on account.controller (deleteAccount): ',
//       error: err,
//     });
//     return res.status(500).json({ err, message: err.toString() });
//   }
// };
