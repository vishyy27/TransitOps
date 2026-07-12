async function run() {
  let res, data;
  
  console.log('1. Login');
  res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alice@transitops.com', password: 'password123' })
  });
  console.log('Status:', res.status);
  data = await res.json();
  const token = data.data?.token;
  if (!token) {
    console.error('Failed to get token:', data);
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  console.log('2. Get Vehicles');
  res = await fetch('http://localhost:3000/vehicles', { headers });
  console.log('Status:', res.status);

  console.log('3. Get Drivers');
  res = await fetch('http://localhost:3000/drivers', { headers });
  console.log('Status:', res.status);

  console.log('4. Create Trip');
  res = await fetch('http://localhost:3000/trips', {
    method: 'POST', headers,
    body: JSON.stringify({ source: 'Warehouse A', destination: 'Store B', vehicle_id: 1, driver_id: 1, cargo_weight: 450, planned_distance: 120.5, revenue: 500 })
  });
  console.log('Status:', res.status);
  data = await res.json();
  if (res.status !== 201) {
    console.error('Failed to create trip', data);
    return;
  }
  const tripId = data.data.id;

  console.log('5. Dispatch Trip');
  res = await fetch(`http://localhost:3000/trips/${tripId}/dispatch`, { method: 'POST', headers });
  console.log('Status:', res.status);
  if (res.status !== 200) console.error(await res.json());

  console.log('6. Complete Trip');
  res = await fetch(`http://localhost:3000/trips/${tripId}/complete`, {
    method: 'POST', headers,
    body: JSON.stringify({ final_odometer: 200, fuel_consumed: 15.2, fuel_cost: 45.6 })
  });
  console.log('Status:', res.status);
  if (res.status !== 200) console.error(await res.json());

  console.log('7. Send Vehicle to Maintenance');
  res = await fetch(`http://localhost:3000/maintenance`, {
    method: 'POST', headers,
    body: JSON.stringify({ vehicle_id: 1, description: 'Oil change', cost: 150.00 })
  });
  console.log('Status:', res.status);
  if (res.status !== 201) console.error(await res.json());

  console.log('8. View Dashboard KPIs');
  res = await fetch(`http://localhost:3000/dashboard/kpis`, { headers });
  console.log('Status:', res.status);

  console.log('9. View Vehicle ROI');
  res = await fetch(`http://localhost:3000/reports/vehicle-roi`, { headers });
  console.log('Status:', res.status);

  console.log('10. Export CSV');
  res = await fetch(`http://localhost:3000/reports/export/csv?type=vehicles`, { headers });
  console.log('Status:', res.status);
}
run();
