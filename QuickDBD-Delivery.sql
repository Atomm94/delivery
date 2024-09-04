-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/qC0TzH
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "Company" (
    "id" int   NOT NULL,
    "phone_number" string   NOT NULL,
    "name" string   NOT NULL,
    -- files
    "license" string[]   NOT NULL,
    -- Default false
    "isVerified:" boolean   NOT NULL,
    -- ENUM: courier, company, customer: default company
    "role" string   NOT NULL,
    -- multiple trucks
    "trucks" int[]   NOT NULL,
    -- multiple drivers
    "drivers" int[]   NOT NULL,
    CONSTRAINT "pk_Company" PRIMARY KEY (
        "id"
     ),
    CONSTRAINT "uc_Company_phone_number" UNIQUE (
        "phone_number"
    )
);

CREATE TABLE "Driver" (
    "id" int   NOT NULL,
    "phone_number" string   NOT NULL,
    "password" string   NOT NULL,
    "firstName" string   NOT NULL,
    "lastName" string   NOT NULL,
    "email" string   NOT NULL,
    "social_number" string   NOT NULL,
    "license" string   NOT NULL,
    "identity" string   NOT NULL,
    "op_state" string   NOT NULL,
    -- multiple cities
    "op_cities" string[]   NOT NULL,
    -- Default false
    "isVerified:" boolean   NOT NULL,
    -- ENUM: courier, company, customer: default courier
    "role" string   NOT NULL,
    -- multiple trucks
    "trucks" int[]   NOT NULL,
    -- multiple loads
    "loads" int[]   NOT NULL,
    CONSTRAINT "pk_Driver" PRIMARY KEY (
        "id"
     ),
    CONSTRAINT "uc_Driver_phone_number" UNIQUE (
        "phone_number"
    )
);

CREATE TABLE "Truck" (
    "id" int   NOT NULL,
    "driverId" int   NOT NULL,
    "mark" string   NOT NULL,
    "model" string   NOT NULL,
    "year" string   NOT NULL,
    "vin_code" string   NOT NULL,
    "license_plate_number" string   NOT NULL,
    "max_capacity" number   NOT NULL,
    "length" number   NOT NULL,
    "width" number   NOT NULL,
    "height" number   NOT NULL,
    "type" string   NOT NULL,
    -- Enum: 'normal', 'good', 'fine'
    "condition" string   NOT NULL,
    -- string[] multiple photos
    "vehicle_title" string[]   NOT NULL,
    -- cargo and car insurances
    "insurances" string[]   NOT NULL,
    -- truck photos
    "photos" string[]   NOT NULL,
    -- Default: false
    "porter" boolean   NOT NULL,
    -- Default: false
    "second_porter" boolean   NOT NULL,
    -- Default: false
    "third_porter" boolean   NOT NULL,
    -- Default: false
    "emergency_driver" boolean   NOT NULL,
    CONSTRAINT "pk_Truck" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Customer" (
    "id" int   NOT NULL,
    "person_name" string   NOT NULL,
    "person_phone_number" string   NOT NULL,
    "person_email" string   NOT NULL,
    "password" string   NOT NULL,
    -- company name
    "name" string   NOT NULL,
    "email" string   NOT NULL,
    "ITN" string   NOT NULL,
    -- company phone number
    "phone_number" string   NOT NULL,
    -- owner name
    "owner" string   NOT NULL,
    -- owner social number
    "owner_social_number" string   NOT NULL,
    "address" string   NOT NULL,
    "city" string   NOT NULL,
    "state" string   NOT NULL,
    "zip_code" number,   NOT NULL,
    -- inst_name, address, city, state, zip_code
    "addresses" json[]   NOT NULL,
    -- multiple insurances photos
    "docs" string[]   NOT NULL,
    -- Default false
    "isVerified:" boolean   NOT NULL,
    -- ENUM: courier, company, customer: default customer
    "role" string   NOT NULL,
    -- multiple loads
    "loads" int[]   NOT NULL,
    CONSTRAINT "pk_Customer" PRIMARY KEY (
        "id"
     ),
    CONSTRAINT "uc_Customer_person_phone_number" UNIQUE (
        "person_phone_number"
    )
);

CREATE TABLE "Load" (
    "id" int   NOT NULL,
    "state" string   NOT NULL,
    "city" string   NOT NULL,
    -- Default: 'POINT(0 0)'
    "coordinates" geo   NOT NULL,
    "zip_code" number   NOT NULL,
    "price" number   NOT NULL,
    "width" number   NOT NULL,
    "length" number   NOT NULL,
    "height" number   NOT NULL,
    "customerId" int   NOT NULL,
    "driverId" int   NOT NULL,
    CONSTRAINT "pk_Load" PRIMARY KEY (
        "id"
     )
);

ALTER TABLE "Company" ADD CONSTRAINT "fk_Company_trucks" FOREIGN KEY("trucks")
REFERENCES "Truck" ("id");

ALTER TABLE "Company" ADD CONSTRAINT "fk_Company_drivers" FOREIGN KEY("drivers")
REFERENCES "Driver" ("id");

ALTER TABLE "Driver" ADD CONSTRAINT "fk_Driver_trucks" FOREIGN KEY("trucks")
REFERENCES "Truck" ("id");

ALTER TABLE "Driver" ADD CONSTRAINT "fk_Driver_loads" FOREIGN KEY("loads")
REFERENCES "Load" ("id");

ALTER TABLE "Truck" ADD CONSTRAINT "fk_Truck_driverId" FOREIGN KEY("driverId")
REFERENCES "Driver" ("id");

ALTER TABLE "Customer" ADD CONSTRAINT "fk_Customer_loads" FOREIGN KEY("loads")
REFERENCES "Load" ("id");

ALTER TABLE "Load" ADD CONSTRAINT "fk_Load_customerId" FOREIGN KEY("customerId")
REFERENCES "Customer" ("id");

ALTER TABLE "Load" ADD CONSTRAINT "fk_Load_driverId" FOREIGN KEY("driverId")
REFERENCES "Driver" ("id");

