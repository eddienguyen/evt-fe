/**
 * Album Images Configuration
 * 
 * Real wedding photos from /public/album/ folder.
 * 
 * @module config/album
 */

import type { GalleryImage } from '@/types/gallery'

/**
 * Real wedding album images
 * 
 * Images are served from /public/album/ directory.
 * Format: NAM_XXXX_(2) Large.jpeg
 */
export const ALBUM_IMAGES: GalleryImage[] = [
  {
    id: 'nam-0327',
    filename: 'NAM_0327_(2) Large.jpeg',
    alt: 'Cô dâu chú rể trong ngày trọng đại',
    caption: 'Khoảnh khắc vàng',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0327_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0327_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0327_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0327_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0012',
    filename: 'NAM_0012_(2) Large.jpeg',
    alt: 'Cô dâu chú rể trong lễ cưới',
    caption: 'Khoảnh khắc thiêng liêng',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0012_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0012_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0012_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0012_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0063',
    filename: 'NAM_0063.jpeg',
    alt: 'Ảnh cưới đẹp của cô dâu chú rể',
    caption: 'Nụ cười hạnh phúc',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0063.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0063.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0063.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0063.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0124',
    filename: 'NAM_0124_(2) Large.jpeg',
    alt: 'Cô dâu chú rể tại lễ cưới',
    caption: 'Khoảnh khắc đáng nhớ',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0124_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0124_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0124_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0124_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0204',
    filename: 'NAM_0204_(2) Large.jpeg',
    alt: 'Ảnh đôi lãng mạn',
    caption: 'Tình yêu vĩnh cửu',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0204_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0204_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0204_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0204_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0221',
    filename: 'NAM_0221_(2) Large.jpeg',
    alt: 'Cô dâu chú rể trong ngày cưới',
    caption: 'Hạnh phúc trọn vẹn',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0221_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0221_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0221_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0221_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0225',
    filename: 'NAM_0225_(2) Large.jpeg',
    alt: 'Khoảnh khắc đẹp trong đám cưới',
    caption: 'Chúc phúc hạnh phúc',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0225_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0225_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0225_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0225_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0255',
    filename: 'NAM_0255_(2) Large.jpeg',
    alt: 'Ảnh cưới đẹp',
    caption: 'Yêu thương vô bờ',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0255_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0255_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0255_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0255_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0282',
    filename: 'NAM_0282_(2) Large.jpeg',
    alt: 'Cô dâu chú rể hạnh phúc',
    caption: 'Nắm tay nhau đi suốt cuộc đời',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0282_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0282_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0282_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0282_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0319',
    filename: 'NAM_0319_(2) Large.jpeg',
    alt: 'Tiệc cưới vui vẻ',
    caption: 'Niềm vui tràn ngập',
    date: '2024-11-01',
    category: 'reception',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0319_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0319_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0319_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0319_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0367',
    filename: 'NAM_0367_(2) Large.jpeg',
    alt: 'Ảnh cưới đẹp lãng mạn',
    caption: 'Tình yêu bất diệt',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0367_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0367_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0367_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0367_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0376',
    filename: 'NAM_0376.jpg',
    alt: 'Đám cưới truyền thống',
    caption: 'Lễ nghi trang trọng',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0376.jpg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0376.jpg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0376.jpg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0376.jpg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0388',
    filename: 'NAM_0388_(2) Large.jpeg',
    alt: 'Cô dâu chú rể cười rạng rỡ',
    caption: 'Hạnh phúc lan tỏa',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0388_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0388_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0388_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0388_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0407',
    filename: 'NAM_0407_(2) Large.jpeg',
    alt: 'Khoảnh khắc ý nghĩa',
    caption: 'Ký ức đẹp',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0407_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0407_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0407_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0407_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0412',
    filename: 'NAM_0412_(2) Large.jpeg',
    alt: 'Cô dâu xinh đẹp',
    caption: 'Vẻ đẹp rạng ngời',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0412_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0412_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0412_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0412_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0431',
    filename: 'NAM_0431_(2) Large.jpeg',
    alt: 'Lễ cưới long trọng',
    caption: 'Khoảnh khắc trang nghiêm',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0431_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0431_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0431_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0431_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0666',
    filename: 'NAM_0666_(2) Large.jpeg',
    alt: 'Ảnh cưới tuyệt đẹp',
    caption: 'Tình yêu ngọt ngào',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0666_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0666_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0666_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0666_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0694',
    filename: 'NAM_0694_(2) Large.jpeg',
    alt: 'Cô dâu chú rể trong tiệc cưới',
    caption: 'Niềm hạnh phúc trọn vẹn',
    date: '2024-11-01',
    category: 'reception',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0694_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0694_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0694_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0694_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0721',
    filename: 'NAM_0721.jpg',
    alt: 'Ảnh cưới phong cách',
    caption: 'Phong thái lịch lãm',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0721.jpg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0721.jpg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0721.jpg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0721.jpg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0772',
    filename: 'NAM_0772_(2) Large.jpeg',
    alt: 'Khoảnh khắc đáng nhớ',
    caption: 'Ký ức vĩnh cửu',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0772_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0772_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0772_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0772_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0790',
    filename: 'NAM_0790_(2) Large.jpeg',
    alt: 'Cô dâu chú rể hạnh phúc',
    caption: 'Nụ cười rực rỡ',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0790_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0790_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0790_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0790_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0914',
    filename: 'NAM_0914_(2) Large.jpeg',
    alt: 'Lễ cưới trang trọng',
    caption: 'Khoảnh khắc thiêng liêng',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0914_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0914_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0914_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0914_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0937',
    filename: 'NAM_0937_(2) Large.jpeg',
    alt: 'Ảnh đôi lãng mạn',
    caption: 'Yêu thương bất tận',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0937_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0937_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0937_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0937_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0968',
    filename: 'NAM_0968_(2) Large.jpeg',
    alt: 'Cô dâu chú rể trong ngày cưới',
    caption: 'Hạnh phúc ngập tràn',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0968_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0968_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0968_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0968_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-0995',
    filename: 'NAM_0995_(2) Large.jpeg',
    alt: 'Khoảnh khắc đáng yêu',
    caption: 'Nét đẹp tự nhiên',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_0995_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_0995_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_0995_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_0995_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9433',
    filename: 'NAM_9433_(2) Large.jpeg',
    alt: 'Tiệc cưới vui vẻ',
    caption: 'Niềm vui chung',
    date: '2024-11-01',
    category: 'reception',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9433_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9433_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9433_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9433_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9472',
    filename: 'NAM_9472_(2) Large.jpeg',
    alt: 'Cô dâu chú rể tại tiệc',
    caption: 'Khoảnh khắc ấm áp',
    date: '2024-11-01',
    category: 'reception',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9472_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9472_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9472_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9472_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9535',
    filename: 'NAM_9535_(2) Large.jpeg',
    alt: 'Ảnh cưới đẹp lung linh',
    caption: 'Tình yêu chan hòa',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9535_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9535_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9535_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9535_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9582',
    filename: 'NAM_9582_(2) Large.jpeg',
    alt: 'Cô dâu chú rể lãng mạn',
    caption: 'Khoảnh khắc ngọt ngào',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9582_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9582_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9582_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9582_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9659',
    filename: 'NAM_9659.jpeg',
    alt: 'Đám cưới truyền thống',
    caption: 'Nét văn hóa đẹp',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9659.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9659.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9659.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9659.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9668',
    filename: 'NAM_9668_(2) Large.jpeg',
    alt: 'Cô dâu chú rể hạnh phúc',
    caption: 'Nụ cười rạng rỡ',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9668_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9668_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9668_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9668_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9690',
    filename: 'NAM_9690_(2) Large.jpeg',
    alt: 'Ảnh cưới đẹp',
    caption: 'Tình yêu mãnh liệt',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9690_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9690_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9690_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9690_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9800',
    filename: 'NAM_9800_(2) Large.jpeg',
    alt: 'Khoảnh khắc cảm động',
    caption: 'Nước mắt hạnh phúc',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9800_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9800_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9800_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9800_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9851',
    filename: 'NAM_9851_(2) Large.jpeg',
    alt: 'Cô dâu chú rể tại tiệc cưới',
    caption: 'Tiệc cưới lung linh',
    date: '2024-11-01',
    category: 'reception',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9851_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9851_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9851_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9851_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9875',
    filename: 'NAM_9875_(2) Large.jpeg',
    alt: 'Ảnh cưới tuyệt đẹp',
    caption: 'Khoảnh khắc vàng',
    date: '2024-11-01',
    category: 'portrait',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9875_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9875_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9875_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9875_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
  {
    id: 'nam-9944',
    filename: 'NAM_9944_(2) Large.jpeg',
    alt: 'Cô dâu chú rể trong ngày trọng đại',
    caption: 'Hành trình hạnh phúc bắt đầu',
    date: '2024-11-01',
    category: 'ceremony',
    sizes: {
      thumbnail: {
        url: '/album/NAM_9944_(2) Large.jpeg',
        width: 400,
        height: 533,
        format: 'jpeg',
      },
      medium: {
        url: '/album/NAM_9944_(2) Large.jpeg',
        width: 800,
        height: 1067,
        format: 'jpeg',
      },
      large: {
        url: '/album/NAM_9944_(2) Large.jpeg',
        width: 1200,
        height: 1600,
        format: 'jpeg',
      },
      original: {
        url: '/album/NAM_9944_(2) Large.jpeg',
        width: 2400,
        height: 3200,
        format: 'jpeg',
      },
    },
    metadata: {
      width: 2400,
      height: 3200,
      format: 'jpeg',
      location: 'Huế',
      photographer: 'Studio NAM',
      dateTaken: new Date('2024-11-01'),
    },
  },
]

/**
 * Featured Images Configuration
 * 
 * Curated selection of images for gallery teaser and promotional use.
 * Selected to showcase diverse categories and best visual appeal.
 */
export const FEATURED_IMAGE_IDS = [
  'nam-0327', // ceremony - wedding details
  'nam-0012', // ceremony - main couple shot
  'nam-0063', // portrait - romantic couple
  'nam-0124', // ceremony - traditional elements
  'nam-0204', // portrait - happy moment
  'nam-0255', // portrait - intimate shot
] as const

/**
 * Get Featured Images for Gallery Teaser
 * 
 * Returns a curated selection of featured images for display in the gallery teaser.
 * Includes diverse categories (ceremony, portrait, reception) for visual variety.
 * 
 * @param count - Number of images to return (default: 6)
 * @param customIds - Optional custom image IDs to override default selection
 * @returns Array of featured gallery images
 * 
 * @example
 * ```typescript
 * // Get default 6 featured images
 * const images = getFeaturedImages()
 * 
 * // Get specific number of images
 * const images = getFeaturedImages(4)
 * 
 * // Use custom image selection
 * const images = getFeaturedImages(3, ['nam-0012', 'nam-0063', 'nam-0124'])
 * ```
 */
export function getFeaturedImages(
  count: number = 6, 
  customIds?: string[]
): GalleryImage[] {
  // Use custom IDs if provided, otherwise use default featured IDs
  const idsToUse = customIds || FEATURED_IMAGE_IDS
  
  // Limit count to available images
  const limitedCount = Math.min(count, idsToUse.length)
  const selectedIds = idsToUse.slice(0, limitedCount)
  
  // Find images by ID and maintain order
  const featuredImages: GalleryImage[] = []
  
  for (const id of selectedIds) {
    const image = ALBUM_IMAGES.find(img => img.id === id)
    if (image) {
      featuredImages.push(image)
    }
  }
  
  // If we don't have enough featured images, fill with random ones from different categories
  if (featuredImages.length < count) {
    const existingIds = new Set(featuredImages.map(img => img.id))
    const remainingImages = ALBUM_IMAGES.filter(img => !existingIds.has(img.id))
    
    // Try to get diverse categories
    const categoriesNeeded = count - featuredImages.length
    const categories = ['ceremony', 'portrait', 'reception']
    
    for (let i = 0; i < categoriesNeeded && remainingImages.length > 0; i++) {
      const category = categories[i % categories.length]
      const categoryImage = remainingImages.find(img => img.category === category)
      
      if (categoryImage) {
        featuredImages.push(categoryImage)
        const index = remainingImages.indexOf(categoryImage)
        remainingImages.splice(index, 1)
      } else if (remainingImages.length > 0) {
        // Fallback to any remaining image
        featuredImages.push(remainingImages[0])
        remainingImages.splice(0, 1)
      }
    }
  }
  
  return featuredImages
}
