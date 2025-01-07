const getEmailTemplate = (contact_person, alarm_time, elapsed_time, support_contact) => {
    return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
         
          <p style="color: #555;"> ${contact_person},</p>
          <p style="color: #555;">アラームがセットされた時刻から10分間、操作が行われていないことを確認しました。
状況をご確認いただき、必要に応じて対応をお願いいたします。</p>
         
          <hr style="border: 1px solid #eee;">
          <h3 style="color: #333;">詳細情報:</h3>
          <ul style="color: #555;">
            <li><strong>アラームセット時刻:</strong> ${alarm_time}</li>
            <li><strong>未操作経過時間:</strong> ${elapsed_time}</li>
          </ul>
          <br/>
          <h3 style="color: #333;">ご対応方法:</h3>
          <p style="color: #555;">システムをご確認ください.</p>
          <p style="color: #555;">ご不明点がございましたら、以下の連絡先までご連絡ください:</p>
          <p style="color: #555;">${support_contact}</p>
          <hr style="border: 1px solid #eee;">
          
          <p style="color: #999;">よろしくお願いいたします
          <br/>(アラーム通知システム)
          </p>
        </div>
      </body>
    </html>
    `
}

module.exports = getEmailTemplate;