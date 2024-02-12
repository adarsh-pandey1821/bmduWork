////development
// export const fileurl = 'http://192.168.0.49:4022';

////production
export const fileurl = 'https://api.fever99.com';

export const url = `${fileurl}/api`;

export const stipeKey = `pk_test_51NtpjXSB14q2spb2JfzPI3EY3xaQgRpgiNYE66qvh6b9WpM6NAEeB3EByLn3fJdwMmnWAMkix4JuMI0cB3U790os00G6RpOr4t`;

export const generateFilePath = (fileName) => {
  if (typeof fileName != 'string') {
    return fileName;
  }

  if (fileName.startsWith('http')) {
    return fileName;
  }

  return `${fileurl}/${fileName}`;
};

export const logoImgUrl = url + '/logo/logo.png';

export default url;