const fs = require("fs");
const express = require("express");

const app = express();
const PORT = 8000; // localhost:8000

// middleware untuk membaca json dari request body ke kita
app.use(express.json());

const customers = JSON.parse(
  fs.readFileSync(`${__dirname}/data/dummy_data.json`)
);

const defaultRouter = (req, res) => {
  res.send("<p>Halo FSW 1</p>")
}

app.get("/", defaultRouter);

// api get all data

// api get data by id
app.get("/api/v1/customers/:id", (req, res, next) => {
  const id = req.params.id;

  // menggunakan array method untuk membantu menemukan spesifik data
  const customer = customers.find((cust) => cust._id === req.params.id);

  // shortcut pemanggilan object
  // const { id } = req.params;
  // console.log(id);

  res.status(200).json({
    status: "success",
    totalData: customers.length,
    data: {
      customers,
    },
  });
});

// api untuk update data
app.patch("/api/v1/customers/:id", (req, res) => {
  const id = req.params.id;

  // if(id )

  // 1. melakukan pencarian data yang sesuai parameter id nya
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  // 2. ada tidak data customer nya
  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: `id : ${id} customer tidak ditemukan`,
    });
  }

  // 3. jika ada, update data sesuai req body dari client/user
  // object assign yaitu menggabungkan object
  customers[customerIndex] = { ...customers[customerIndex], ...req.body };

  // 4. melakukan update di dokumen jsonnya
  fs.writeFile(
    `${__dirname}/data/dummy_data.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "berhasil update data",
      });
    }
  );
});

// api untuk delete data
app.delete("/api/v1/customers/:id", (req, res) => {
  const id = req.params.id;

  // 1. melakukan pencarian data yang sesuai parameter id nya
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  // 2. ada tidak data customer nya
  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: `id : ${id} customer tidak ditemukan`,
    });
  }

  // 3. jika ada, delete data sesuai req body dari client/user
  // object assign yaitu menggabungkan object
  customers.splice(customerIndex, 1);

  // melakukan delete data
  fs.writeFile(
    `${__dirname}/data/dummy_data.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "berhasil delete data",
      });
    }
  );
});

// api untuk create new data
app.post("/api/v1/customers", (req, res) => {
  console.log(req.body);

  const newCustomer = req.body;

  customers.push(newCustomer);

  fs.writeFile(
    `${__dirname}/data/dummy_data.json`,
    JSON.stringify(customers),
    (err) =>
      res.status(200).json({
        status: "success",
        data: {
          customers: newCustomer,
        },
      })
  );

  res.send("oke udah");
});

app.listen(PORT, () => {
  console.log(`APP runing on port : ${PORT}`);
});
