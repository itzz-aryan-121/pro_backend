const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/visit-app', {
	
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(()=>{
    console.log('Connected to  database');
   
}) .catch(err=>{
    console.log("error",err);
});
	


const UserSchema = new mongoose.Schema({
	name: {
	  type: String,
	  required: true,
	},
	email: {
	  type: String,
	  required: true,
	  unique: true,
	},
	approved: {
	  type: Boolean,
	  default: null,
	},
	date: {
	  type: Date,
	  default: Date.now,
	},
  });
  
const User = mongoose.model('users', UserSchema);
User.createIndexes();


const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 8001");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

	resp.send("App is Working");
	
});

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'aryantomar239@gmail.com',
	  pass: 'bawn atug muom xugd'
	}
  });

// backend/index.js
app.post("/register", async (req, resp) => {
	try {
		const { name, email, recipientEmail } = req.body;
	  const user = new User(req.body);
	  let result = await user.save();
	  result = result.toObject();
	  if (result) {
		delete result.password;
		resp.json(req.body);
		console.log(result);
  
		// Send email to recipient
		const mailOptions = {
		  from: 'your-email@gmail.com',
		  to: recipientEmail,
		  subject: 'New User Registration',
		  html: `
			<p>A new user has registered.</p>
			<p>Name: ${result.name}</p>
			<p>Email: ${result.email}</p>
			<p>
			  <a href="http://localhost:6001/approve/${result._id}">Approve</a> |
			  <a href="http://localhost:6001/disapprove/${result._id}">Disapprove</a>
			</p>
		  `
		};
  
		transporter.sendMail(mailOptions, (error, info) => {
		  if (error) {
			console.log(error);
		  } else {
			console.log('Email sent: ' + info.response);
		  }
		});
	  } else {
		console.log("User already registered");
	  }
	} catch (e) {
	  resp.status(500).json({ error: "Something Went Wrong" });
	}
  });
  
  app.put('/approve/:id', async (req, res) => {
	try {
	  const { id } = req.params;
	  const updatedUser = await User.findByIdAndUpdate(id, { approved: true }, { new: true });
  
	  if (updatedUser) {
		res.json(updatedUser);
	  } else {
		res.status(404).json({ error: 'User not found' });
	  }
	} catch (error) {
	  res.status(500).json({ error: 'Something went wrong' });
	}
  });
  app.get('/approve/:id', async (req, res) => {
	try {
	  const { id } = req.params;
	  const updatedUser = await User.findByIdAndUpdate(id, { approved: true }, { new: true });
  
	  if (updatedUser) {
		res.send('User approved successfully.');
	  } else {
		res.status(404).send('User not found.');
	  }
	} catch (error) {
	  res.status(500).send('Something went wrong.');
	}
  });
  app.get('/disapprove/:id', async (req, res) => {
	try {
	  const { id } = req.params;
	  const updatedUser = await User.findByIdAndUpdate(id, { approved: false }, { new: true });
  
	  if (updatedUser) {
		res.send('User disapproved successfully.');
	  } else {
		res.status(404).send('User not found.');
	  }
	} catch (error) {
	  res.status(500).send('Something went wrong.');
	}
  });

  app.put('/disapprove/:id', async (req, res) => {
	try {
	  const { id } = req.params;
	  const updatedUser = await User.findByIdAndUpdate(id, { approved: false }, { new: true });
  
	  if (updatedUser) {
		res.json(updatedUser);
	  } else {
		res.status(404).json({ error: 'User not found' });
	  }
	} catch (error) {
	  res.status(500).json({ error: 'Something went wrong' });
	}
  });
app.put('/update', async (req, res) => {
	try {
	  const { id, name, email } = req.body;
  
	  const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
  
	  if (updatedUser) {
		res.json(updatedUser);
	  } else {
		res.status(404).json({ error: 'User not found' });
	  }
	} catch (error) {
	  res.status(500).json({ error: 'Something went wrong' });
	}
  });

  // backend/index.js
// backend/index.js
  




  app.delete('/Delete/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
	 
      
      const deletedUser = await User.findOneAndDelete({ _id: userId });
  
      if (deletedUser) {
        res.json(deletedUser);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });



app.get('/api/data', async (req, res) => {
	
	try {

	 const data = await User.find();
	
	  res.json(data);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });




app.listen(8001);
