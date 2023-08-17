import axios from "axios";

export default {
    methods: {
        // 撈輪播圖圖片
        async getPopularActivityImages() {
            try {
                const response = await axios({
                    method: 'get',
                    url: `/ads/indexBanners?category=line-popular-activity`
                })
                const images = response.data
                
                return images
            } catch (error) {
                console.error(error)
            }
        }
    }
}