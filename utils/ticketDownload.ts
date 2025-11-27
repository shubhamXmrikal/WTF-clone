import html2canvas from 'html2canvas';
import logo from "../assets/image.png";

export interface TicketData {
  eventName: string;
  eventImage?: string;
  location: string;
  dateTime: number;
  bookingId: string;
  ticketCount: number;
  amount: number;
  organizerName?: string;
  organizerLogo?: string;
}

export const generateTicketHTML = (data: TicketData): string => {
  const eventDate = new Date(data.dateTime * 1000);
  const dateStr = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const timeStr = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <div style="
      width: 800px;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      border-radius: 24px;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      position: relative;
    ">
      <!-- Header Accent -->
      <div style="
        height: 6px;
        background: linear-gradient(90deg, #ff0033 0%, #ff6b6b 100%);
      "></div>

      <!-- Event Image / Logo Section -->
      <div style="
        width: 100%;
        height: 300px;
        background-color: #000;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
        ${logo ? `
            <img src="${logo}" style="
                width: 100%;
                height: 100%;
                object-fit: contain;
                padding: 40px;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
            " onerror="this.style.display='none'; document.getElementById('fallback-logo').style.display='block';" />
            
            <img id="fallback-logo" src="${logo}" style="
                display: none; 
                width: 200px;
                height: auto;
                z-index: 10;
            " />
        ` : `
            <img src="${logo}" style="
                width: 200px;
                height: auto;
                z-index: 10;
            " />
        `}
        
        <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, #0a0a0a, transparent);
            padding: 40px 40px 20px;
            z-index: 20;
        ">
            <h1 style="
              color: white;
              font-size: 36px;
              font-weight: 800;
              margin: 0;
              text-shadow: 0 2px 10px rgba(0,0,0,0.8);
              text-align: center;
            ">${data.eventName}</h1>
        </div>
      </div>

      <!-- Content Section -->
      <div style="padding: 40px;">
        <!-- Date, Time, Location -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        ">
          <div style="
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
          ">
            <div style="
              color: #999;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 8px;
            ">Date & Time</div>
            <div style="
              color: white;
              font-size: 18px;
              font-weight: 600;
            ">${dateStr}</div>
            <div style="
              color: #ff0033;
              font-size: 24px;
              font-weight: 700;
              margin-top: 4px;
            ">${timeStr}</div>
          </div>

          <div style="
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
          ">
            <div style="
              color: #999;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 8px;
            ">Tickets</div>
            <div style="
              color: #ff0033;
              font-size: 48px;
              font-weight: 800;
              line-height: 1;
            ">${data.ticketCount}</div>
          </div>
        </div>

        <!-- Location -->
        <div style="
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 32px;
        ">
          <div style="
            color: #999;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          ">Location</div>
          <div style="
            color: white;
            font-size: 16px;
            line-height: 1.5;
          ">${data.location}</div>
        </div>

        <!-- Booking ID (Centered, No QR) -->
        <div style="
          background: rgba(255, 0, 51, 0.1);
          border: 2px dashed rgba(255, 0, 51, 0.3);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        ">
            <div style="
              color: #999;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 8px;
            ">Booking ID</div>
            <div style="
              color: #ff0033;
              font-size: 32px;
              font-weight: 700;
              font-family: 'Courier New', monospace;
              letter-spacing: 2px;
            ">${data.bookingId}</div>
            <div style="
              color: #666;
              font-size: 14px;
              margin-top: 12px;
            ">Amount: ₹${data.amount.toFixed(2)}</div>
        </div>

        <!-- Footer -->
        ${data.organizerName ? `
          <div style="
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            text-align: center;
          ">
            <div style="
                color: #999;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
            ">Organized by</div>
            
            <div style="display: flex; align-items: center; gap: 12px;">
                ${data.organizerLogo ? `
                <img src="${data.organizerLogo}" style="
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                " />
                ` : ''}
                <div style="
                    color: white;
                    font-size: 18px;
                    font-weight: 600;
                ">${data.organizerName}</div>
            </div>
          </div>
        ` : ''}

        <!-- WTF Branding -->
        <div style="
          margin-top: 32px;
          text-align: center;
          color: #666;
          font-size: 14px;
        ">
          <div style="
            color: #ff0033;
            font-size: 24px;
            font-weight: 800;
            font-family: 'Teko', sans-serif;
            letter-spacing: 2px;
            margin-bottom: 4px;
          ">WHATHEFOOTBALL</div>
          Powered by WTF! Platform
        </div>
      </div>
    </div>
  `;
};

export const downloadTicket = async (data: TicketData): Promise<void> => {
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.innerHTML = generateTicketHTML(data);
  document.body.appendChild(container);

  try {
    // Wait for images to load
    const images = container.getElementsByTagName('img');
    await Promise.all(
      Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(null);
          } else {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null);
          }
        });
      })
    );

    // Wait a bit for DOM to settle
    await new Promise(resolve => setTimeout(resolve, 100));

    const element = container.firstElementChild as HTMLElement;
    if (!element) throw new Error('Ticket element not found');

    // Generate canvas
    const canvas = await html2canvas(element, {
      backgroundColor: '#0a0a0a',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.body.firstElementChild as HTMLElement;
        if (clonedElement) {
          clonedElement.style.transform = 'none';
        }
      }
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `WTF-Ticket-${data.bookingId}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');

  } catch (error) {
    console.error('Error generating ticket:', error);
    alert('Failed to generate ticket. Please try again.');
  } finally {
    // Clean up
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
