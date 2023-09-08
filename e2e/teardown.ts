async function globalTeardown() {
  console.log(process.env['TENDERLY_ENDPOINT']);
}

export default globalTeardown;
