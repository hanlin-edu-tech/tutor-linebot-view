import axios from "axios";
import dayjs from "dayjs";

export default {
    methods: {
        async searchLineCouponListWithStudentCard(studentCard) {
            try {
                // 處理優惠券
                const response = await axios({
                    method: 'get',
                    url: `/shop/coupon/list?studentCard=${studentCard}&from=line@`
                })
                const coupons = response.data
                
                return coupons
            } catch (error) {
                console.error(error)
            }
        },
        
        async searchCouponListWithStudentCard(studentCard)  {
            try {
                // 處理優惠券
                const response = await axios({
                    method: 'get',
                    url: `/shop/coupon/list?studentCard=${studentCard}`
                })
                const coupons = response.data
        
                return coupons
            } catch (error) {
                console.error(error)
            }
        },
        
        formatDiscount(discount) {
            if (Number.isInteger(discount)) {
                return discount + '<span>元</span>'
            }
    
            const len = discount.toString().split('.')[1].length
    
            switch (len) {
                case 1:
                    discount *= 10
                    break
                case 2:
                    discount *= 100
                    break
                case 3:
                    discount *= 1000
                    break
            }
            return discount + '<span>折</span>'
        },
        
        formatDate(day) {
            if (day) {
                return dayjs(day).format('YYYY/MM/DD')
            } else {
                return '無期限'
            }
        },
        
        isDeadLine(end) {
            const now = dayjs().locale('zh-tw')
            if (end) {
                return dayjs(end).diff(now, 'day') < 0
            }
            return false
        },
    
        computeRemainingDate(end) {
            const now = dayjs().locale('zh-tw')
            const date = dayjs(end).locale('zh-tw')
            return dayjs(date).diff(dayjs(now), 'days')
        }
    }
}