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
                return discount + '<span style="font-size:16px; margin:0 0 8px 0;">元</span>'
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
            return discount + '<span style="font-size:16px; margin:0 0 8px 0;">折</span>'
        },
        
        formatDate(day) {
            if (day) {
                return dayjs(day).format('YYYY/MM/DD')
            } else {
                return '無期限'
            }
        },
        
        isDeadLine(end) {
            const now = dayjs()
            if (end) {
                return dayjs(end).isBefore(now)
            }
            return false
        },
    
        computeRemainingDate(end) {
            const now = dayjs()
            const date = dayjs(end)
            const diff = date.diff(now, 'days')
            return diff
        }
    }
}