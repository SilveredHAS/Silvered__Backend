function GetShippingAddress(shippingAddress) {
  if (!shippingAddress) {
    return "";
  }
  const {
    firstName,
    lastName,
    mobileNumber,
    email,
    houseNo,
    area,
    landmark,
    city,
    state,
    pincode,
  } = shippingAddress;
  let calcShippingAddress = `${firstName} ${lastName} ${houseNo} ${area} ${landmark} ${city} ${state} -  ${pincode}. Mobile: ${mobileNumber}. Email: ${email}`;
  return calcShippingAddress;
}

module.exports = GetShippingAddress;
