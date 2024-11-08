const js = {
  "onloading_time": "2024-11-10T08:00:00Z",
  "start_time": "2024-11-10T09:00:00Z",
  "car_type": "Truck",
  "porter": "John Doe",
  "status": "incoming",
  "orders": [
    {
      "addressId": 1,
      "products": [
        {
          "name": "Sample Product",
          "weight": 5,
          "length": 30,
          "width": 20,
          "height": 15,
          "measure": "liter",
          "type": "product"
        }
      ]
    },
    {
      "addressId": 2,
      "products": [
        {
          "name": "Another Product",
          "weight": 2.5,
          "length": 15,
          "width": 10,
          "height": 5,
          "measure": "liter",
          "type": "box"
        }
      ]
    }
  ],
  "loadAddresses": [
    3,
    4
  ]
}

console.log(js);