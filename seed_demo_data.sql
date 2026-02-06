-- =====================================================
-- COMPLETE SUPABASE SEED SCRIPT FOR DEMO ORGANIZATION
-- =====================================================
-- Inserts realistic backdated data for demo organization
-- Data spans November 2025 through February 2026 (90 days)
-- =====================================================

DO $$
DECLARE
  demo_org_id UUID;
  customer_ids UUID[];
  vehicle_ids UUID[];
  technician_ids UUID[];
  work_order_ids UUID[];
  estimate_ids UUID[];
  temp_customer_id UUID;
  temp_vehicle_id UUID;
  temp_technician_id UUID;
  temp_work_order_id UUID;
  temp_estimate_id UUID;
  i INTEGER;
  j INTEGER;
  random_days INTEGER;
  random_status TEXT;
  random_service_type TEXT;
  service_price NUMERIC;
  labor_hours NUMERIC;
BEGIN
  -- Get demo organization ID
  SELECT id INTO demo_org_id FROM organizations WHERE subdomain = 'demo';
  
  IF demo_org_id IS NULL THEN
    RAISE EXCEPTION 'Demo organization not found. Please create it first.';
  END IF;

  RAISE NOTICE 'Using demo organization ID: %', demo_org_id;

  -- Initialize arrays
  customer_ids := ARRAY[]::UUID[];
  vehicle_ids := ARRAY[]::UUID[];
  technician_ids := ARRAY[]::UUID[];
  work_order_ids := ARRAY[]::UUID[];
  estimate_ids := ARRAY[]::UUID[];

  -- =====================================================
  -- INSERT TECHNICIANS (4 technicians)
  -- =====================================================
  RAISE NOTICE 'Inserting technicians...';
  
  FOR i IN 1..4 LOOP
    temp_technician_id := gen_random_uuid();
    INSERT INTO profiles (id, email, first_name, last_name, phone, role, organization_id, created_at)
    VALUES (
      temp_technician_id,
      CASE i
        WHEN 1 THEN 'mike.johnson@demo.overdryv.io'
        WHEN 2 THEN 'sarah.williams@demo.overdryv.io'
        WHEN 3 THEN 'david.brown@demo.overdryv.io'
        ELSE 'jennifer.davis@demo.overdryv.io'
      END,
      CASE i
        WHEN 1 THEN 'Mike'
        WHEN 2 THEN 'Sarah'
        WHEN 3 THEN 'David'
        ELSE 'Jennifer'
      END,
      CASE i
        WHEN 1 THEN 'Johnson'
        WHEN 2 THEN 'Williams'
        WHEN 3 THEN 'Brown'
        ELSE 'Davis'
      END,
      '555-010' || i,
      'technician',
      demo_org_id,
      NOW() - INTERVAL '180 days'
    );
    technician_ids := array_append(technician_ids, temp_technician_id);
  END LOOP;

  -- =====================================================
  -- INSERT CUSTOMERS (18 customers)
  -- =====================================================
  RAISE NOTICE 'Inserting customers...';
  
  FOR i IN 1..18 LOOP
    temp_customer_id := gen_random_uuid();
    INSERT INTO profiles (id, email, first_name, last_name, phone, role, organization_id, created_at)
    VALUES (
      temp_customer_id,
      CASE i
        WHEN 1 THEN 'john.smith@email.com'
        WHEN 2 THEN 'emily.jones@email.com'
        WHEN 3 THEN 'michael.wilson@email.com'
        WHEN 4 THEN 'jessica.taylor@email.com'
        WHEN 5 THEN 'robert.anderson@email.com'
        WHEN 6 THEN 'amanda.thomas@email.com'
        WHEN 7 THEN 'william.jackson@email.com'
        WHEN 8 THEN 'ashley.white@email.com'
        WHEN 9 THEN 'james.harris@email.com'
        WHEN 10 THEN 'sarah.martin@email.com'
        WHEN 11 THEN 'christopher.garcia@email.com'
        WHEN 12 THEN 'melissa.rodriguez@email.com'
        WHEN 13 THEN 'daniel.martinez@email.com'
        WHEN 14 THEN 'laura.hernandez@email.com'
        WHEN 15 THEN 'matthew.lopez@email.com'
        WHEN 16 THEN 'stephanie.gonzalez@email.com'
        WHEN 17 THEN 'kevin.wilson@email.com'
        ELSE 'nicole.moore@email.com'
      END,
      CASE i
        WHEN 1 THEN 'John' WHEN 2 THEN 'Emily' WHEN 3 THEN 'Michael'
        WHEN 4 THEN 'Jessica' WHEN 5 THEN 'Robert' WHEN 6 THEN 'Amanda'
        WHEN 7 THEN 'William' WHEN 8 THEN 'Ashley' WHEN 9 THEN 'James'
        WHEN 10 THEN 'Sarah' WHEN 11 THEN 'Christopher' WHEN 12 THEN 'Melissa'
        WHEN 13 THEN 'Daniel' WHEN 14 THEN 'Laura' WHEN 15 THEN 'Matthew'
        WHEN 16 THEN 'Stephanie' WHEN 17 THEN 'Kevin' ELSE 'Nicole'
      END,
      CASE i
        WHEN 1 THEN 'Smith' WHEN 2 THEN 'Jones' WHEN 3 THEN 'Wilson'
        WHEN 4 THEN 'Taylor' WHEN 5 THEN 'Anderson' WHEN 6 THEN 'Thomas'
        WHEN 7 THEN 'Jackson' WHEN 8 THEN 'White' WHEN 9 THEN 'Harris'
        WHEN 10 THEN 'Martin' WHEN 11 THEN 'Garcia' WHEN 12 THEN 'Rodriguez'
        WHEN 13 THEN 'Martinez' WHEN 14 THEN 'Hernandez' WHEN 15 THEN 'Lopez'
        WHEN 16 THEN 'Gonzalez' WHEN 17 THEN 'Wilson' ELSE 'Moore'
      END,
      '555-10' || LPAD(i::TEXT, 2, '0'),
      'customer',
      demo_org_id,
      NOW() - INTERVAL '240 days' + (i * INTERVAL '10 days')
    );
    customer_ids := array_append(customer_ids, temp_customer_id);
  END LOOP;

  -- =====================================================
  -- INSERT VEHICLES (24 vehicles)
  -- =====================================================
  RAISE NOTICE 'Inserting vehicles...';
  
  FOR i IN 1..24 LOOP
    temp_vehicle_id := gen_random_uuid();
    INSERT INTO vehicles (id, customer_id, organization_id, year, make, model, vin, license_plate, mileage, color, created_at)
    VALUES (
      temp_vehicle_id,
      customer_ids[((i - 1) % array_length(customer_ids, 1)) + 1],
      demo_org_id,
      2015 + (i % 11),
      CASE (i % 10)
        WHEN 0 THEN 'Toyota' WHEN 1 THEN 'Honda' WHEN 2 THEN 'Ford'
        WHEN 3 THEN 'Chevrolet' WHEN 4 THEN 'Nissan' WHEN 5 THEN 'BMW'
        WHEN 6 THEN 'Mercedes-Benz' WHEN 7 THEN 'Volkswagen' WHEN 8 THEN 'Hyundai'
        ELSE 'Mazda'
      END,
      CASE (i % 10)
        WHEN 0 THEN 'Camry' WHEN 1 THEN 'Accord' WHEN 2 THEN 'F-150'
        WHEN 3 THEN 'Silverado' WHEN 4 THEN 'Altima' WHEN 5 THEN '3 Series'
        WHEN 6 THEN 'C-Class' WHEN 7 THEN 'Jetta' WHEN 8 THEN 'Elantra'
        ELSE 'CX-5'
      END,
      'VIN' || LPAD(i::TEXT, 14, '0'),
      CASE (i % 26) + 65
        WHEN 65 THEN 'ABC' WHEN 66 THEN 'DEF' WHEN 67 THEN 'GHI'
        WHEN 68 THEN 'JKL' WHEN 69 THEN 'MNO' WHEN 70 THEN 'PQR'
        WHEN 71 THEN 'STU' WHEN 72 THEN 'VWX' ELSE 'YZA'
      END || LPAD(i::TEXT, 4, '0'),
      45000 + (i * 5000),
      CASE (i % 8)
        WHEN 0 THEN 'Black' WHEN 1 THEN 'White' WHEN 2 THEN 'Silver'
        WHEN 3 THEN 'Blue' WHEN 4 THEN 'Red' WHEN 5 THEN 'Gray'
        WHEN 6 THEN 'Green' ELSE 'Brown'
      END,
      NOW() - INTERVAL '200 days' + (i * INTERVAL '5 days')
    );
    vehicle_ids := array_append(vehicle_ids, temp_vehicle_id);
  END LOOP;

  -- =====================================================
  -- INSERT WORK ORDERS (45 work orders over 90 days)
  -- =====================================================
  RAISE NOTICE 'Inserting work orders...';
  
  FOR i IN 1..45 LOOP
    random_days := 90 - (i * 2);
    random_status := CASE (i % 10)
      WHEN 0 THEN 'pending'
      WHEN 1 THEN 'in_progress'
      ELSE 'completed'
    END;
    
    random_service_type := CASE (i % 9)
      WHEN 0 THEN 'Oil Change'
      WHEN 1 THEN 'Brake Service'
      WHEN 2 THEN 'Tire Rotation'
      WHEN 3 THEN 'Diagnostic'
      WHEN 4 THEN 'Transmission Service'
      WHEN 5 THEN 'AC Repair'
      WHEN 6 THEN 'Engine Repair'
      WHEN 7 THEN 'Alignment'
      ELSE 'Inspection'
    END;
    
    service_price := CASE random_service_type
      WHEN 'Oil Change' THEN 49.99 + (random() * 30)
      WHEN 'Brake Service' THEN 250.00 + (random() * 200)
      WHEN 'Tire Rotation' THEN 39.99 + (random() * 20)
      WHEN 'Diagnostic' THEN 89.99 + (random() * 60)
      WHEN 'Transmission Service' THEN 450.00 + (random() * 300)
      WHEN 'AC Repair' THEN 180.00 + (random() * 150)
      WHEN 'Engine Repair' THEN 800.00 + (random() * 1200)
      WHEN 'Alignment' THEN 79.99 + (random() * 50)
      ELSE 120.00 + (random() * 80)
    END;
    
    labor_hours := CASE random_service_type
      WHEN 'Oil Change' THEN 0.5 + (random() * 0.3)
      WHEN 'Brake Service' THEN 2.0 + (random() * 1.5)
      WHEN 'Tire Rotation' THEN 0.5 + (random() * 0.3)
      WHEN 'Diagnostic' THEN 1.0 + (random() * 1.0)
      WHEN 'Transmission Service' THEN 4.0 + (random() * 3.0)
      WHEN 'AC Repair' THEN 2.5 + (random() * 2.0)
      WHEN 'Engine Repair' THEN 8.0 + (random() * 8.0)
      WHEN 'Alignment' THEN 1.0 + (random() * 0.5)
      ELSE 1.5 + (random() * 1.0)
    END;
    
    temp_work_order_id := gen_random_uuid();
    
    INSERT INTO work_orders (
      id, customer_id, vehicle_id, organization_id, assigned_to,
      status, description, notes, estimated_completion,
      created_at, updated_at
    )
    VALUES (
      temp_work_order_id,
      customer_ids[((i - 1) % array_length(customer_ids, 1)) + 1],
      vehicle_ids[((i - 1) % array_length(vehicle_ids, 1)) + 1],
      demo_org_id,
      technician_ids[((i - 1) % array_length(technician_ids, 1)) + 1],
      random_status,
      random_service_type,
      'Customer reported issues with ' || random_service_type || '. Inspection completed.',
      CASE WHEN random_status = 'completed' 
        THEN NOW() - INTERVAL '1 day' * random_days + INTERVAL '2 days'
        ELSE NOW() + INTERVAL '2 days'
      END,
      NOW() - INTERVAL '1 day' * random_days,
      NOW() - INTERVAL '1 day' * (random_days - 1)
    );
    
    work_order_ids := array_append(work_order_ids, temp_work_order_id);
    
    -- Insert 1-3 service items per work order
    FOR j IN 1..(1 + (i % 3)) LOOP
      INSERT INTO service_items (
        id, work_order_id, description, quantity,
        labor_hours, parts_cost, labor_rate, total_cost,
        created_at
      )
      VALUES (
        gen_random_uuid(),
        temp_work_order_id,
        random_service_type || ' - ' || CASE j
          WHEN 1 THEN 'Parts'
          WHEN 2 THEN 'Labor'
          ELSE 'Additional Service'
        END,
        1,
        CASE j WHEN 2 THEN labor_hours ELSE 0 END,
        CASE j WHEN 1 THEN service_price * 0.4 ELSE 0 END,
        95.00,
        CASE j
          WHEN 1 THEN service_price * 0.4
          WHEN 2 THEN labor_hours * 95.00
          ELSE service_price * 0.2
        END,
        NOW() - INTERVAL '1 day' * random_days
      );
    END LOOP;
    
    -- Create invoice for completed work orders
    IF random_status = 'completed' THEN
      INSERT INTO invoices (
        id, work_order_id, customer_id, organization_id,
        subtotal, tax_rate, tax_amount, total_amount,
        payment_status, payment_method, payment_date,
        created_at
      )
      VALUES (
        gen_random_uuid(),
        temp_work_order_id,
        customer_ids[((i - 1) % array_length(customer_ids, 1)) + 1],
        demo_org_id,
        service_price,
        8.25,
        ROUND(service_price * 0.0825, 2),
        ROUND(service_price * 1.0825, 2),
        CASE WHEN (i % 5) = 0 THEN 'pending' ELSE 'paid' END,
        CASE (i % 3)
          WHEN 0 THEN 'cash'
          WHEN 1 THEN 'card'
          ELSE 'check'
        END,
        CASE WHEN (i % 5) != 0 
          THEN NOW() - INTERVAL '1 day' * (random_days - 1)
          ELSE NULL
        END,
        NOW() - INTERVAL '1 day' * (random_days - 1)
      );
    END IF;
  END LOOP;

  -- =====================================================
  -- INSERT ESTIMATES (12 estimates)
  -- =====================================================
  RAISE NOTICE 'Inserting estimates...';
  
  FOR i IN 1..12 LOOP
    random_days := 60 - (i * 5);
    
    random_service_type := CASE (i % 6)
      WHEN 0 THEN 'Brake Replacement'
      WHEN 1 THEN 'Engine Diagnostics'
      WHEN 2 THEN 'Transmission Repair'
      WHEN 3 THEN 'AC System Overhaul'
      WHEN 4 THEN 'Suspension Work'
      ELSE 'Electrical Repair'
    END;
    
    service_price := CASE random_service_type
      WHEN 'Brake Replacement' THEN 400.00 + (random() * 200)
      WHEN 'Engine Diagnostics' THEN 150.00 + (random() * 100)
      WHEN 'Transmission Repair' THEN 1200.00 + (random() * 800)
      WHEN 'AC System Overhaul' THEN 600.00 + (random() * 400)
      WHEN 'Suspension Work' THEN 500.00 + (random() * 300)
      ELSE 350.00 + (random() * 250)
    END;
    
    temp_estimate_id := gen_random_uuid();
    
    INSERT INTO estimates (
      id, customer_id, vehicle_id, organization_id,
      description, labor_cost, parts_cost, total_cost,
      status, valid_until, created_at
    )
    VALUES (
      temp_estimate_id,
      customer_ids[((i - 1) % array_length(customer_ids, 1)) + 1],
      vehicle_ids[((i - 1) % array_length(vehicle_ids, 1)) + 1],
      demo_org_id,
      random_service_type,
      service_price * 0.6,
      service_price * 0.4,
      service_price,
      CASE (i % 4)
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'approved'
        WHEN 2 THEN 'declined'
        ELSE 'expired'
      END,
      NOW() - INTERVAL '1 day' * random_days + INTERVAL '30 days',
      NOW() - INTERVAL '1 day' * random_days
    );
    
    estimate_ids := array_append(estimate_ids, temp_estimate_id);
  END LOOP;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Seed data insertion completed successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Summary:';
  RAISE NOTICE '  - Technicians: %', array_length(technician_ids, 1);
  RAISE NOTICE '  - Customers: %', array_length(customer_ids, 1);
  RAISE NOTICE '  - Vehicles: %', array_length(vehicle_ids, 1);
  RAISE NOTICE '  - Work Orders: %', array_length(work_order_ids, 1);
  RAISE NOTICE '  - Estimates: %', array_length(estimate_ids, 1);
  RAISE NOTICE '========================================';

END $$;
