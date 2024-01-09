function GetShippingAddress(shippingAddress) {
  if (!shippingAddress) {
    return "";
  }
  const {
    firstName,
    lastName,
    mobileNumber,
    houseNo,
    area,
    landmark,
    city,
    state,
    pincode,
  } = shippingAddress;
  let calcShippingAddress = `${firstName} ${lastName} ${houseNo} ${area} ${landmark} ${city} ${state} -  ${pincode}. Mobile: ${mobileNumber}`;
  return calcShippingAddress;
}

module.exports = GetShippingAddress;
