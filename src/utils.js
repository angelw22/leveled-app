import uuidv4 from 'uuid/v4';
import { redisClient } from './';

export const getRandomId = () => {
  return uuidv4();
}

export const getUser = sessionId => {
  let sessionKey = undefined;
  let user = undefined;
  return new Promise((resolve, reject) => {
    let stream = redisClient.scanStream({
      match: `sess:${sessionId}`,
      count: 10
    });
  
    stream.on("data", resultKeys => {
      for (var i = 0; i < resultKeys.length; i++) {
        sessionKey = resultKeys[i];
        break;
      }
    })
  
    stream.on("end", async () => {
      try {
        user = await redisClient.get(sessionKey);
        resolve(user);
      } catch(error) {
        console.log(error);
      }
    })
  })
}

export const getSessionIdFromCookies = cookies => {
  let regex = /(challengerSession=s%3A)/g;
  let cookiesArray = cookies.split('; ');

  let challengerCookie = cookiesArray.find(cookieStr => regex.test(cookieStr));

  if (challengerCookie) {
    return challengerCookie.replace('challengerSession=s%3A', '').split('.')[0];
  } else {
    return null;
  }
}