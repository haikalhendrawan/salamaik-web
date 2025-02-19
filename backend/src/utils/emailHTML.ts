/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

// used on kirim email login dan register

export function otpEmailHTML(email: string, otp: string){
  return (
    `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
        <h1 style="color:#8f0916">Salamaik</h6>
        </div>
        <p>Hi ${email},</p>
        <p>Gunakan kode OTP berikut untuk menyelesaikan pendaftaran. OTP valid untuk 1 menit</p>
        <h2 style="background: #8f0916;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Kanwil DJPb Sumbar</p>
          <p>Jl. Khatib Sulaiman No.3,Kota Padang</p>
          <p>Sumatera Barat</p>
        </div>
      </div>
    </div>`)
}