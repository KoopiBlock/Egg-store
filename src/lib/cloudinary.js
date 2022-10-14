import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
    cloud: {
      cloudName: 'dxb9tfd2q'
    },
    url: {
      secure: true
    }
  })


export function buildImage(src) {
    return cld.image(src).quality('auto').format('auto')
}

