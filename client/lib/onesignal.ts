export function getOneSignalBootstrapScript() {
  return `
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    console.info("[OneSignal] bootstrap queued", {
      origin: window.location.origin,
    });
    OneSignalDeferred.push(async function(OneSignal) {
      console.info("[OneSignal] init starting");
      try {
        await OneSignal.init({
          appId: "e15ad3e1-b157-4e95-985d-4816a48d2e56",
          safari_web_id: "web.onesignal.auto.0e007fdd-4c29-4efe-85fd-d9ae8478b7ea",
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: true,
          },
        });
        console.info("[OneSignal] init complete", {
          permission: OneSignal.Notifications.permission,
          subscribed: OneSignal.User.PushSubscription.optedIn,
          subscriptionId: OneSignal.User.PushSubscription.id,
        });
      } catch (error) {
        console.error("[OneSignal] init failed", error);
      }
    });
  `;
}

export function getOneSignalHelperScript(apiUrl: string) {
  const allowNotifUrl = JSON.stringify(`${apiUrl}/changeNotif`);

  return `
    (function(){
      try{
        var style = document.createElement('style');
        style.id = 'kineq-onesignal-style';
        style.innerHTML = '.hide-onesignal-bell .onesignal-bell-launcher { display: none !important; }';
        document.head.appendChild(style);
      }catch(e){console.warn('style inject failed', e)}

      window.OneSignalDeferred = window.OneSignalDeferred || [];

      function decodeJwtEmail(token) {
        try {
          if (!token || typeof token !== 'string') return null;
          var parts = token.split('.');
          if (parts.length < 2) return null;
          var payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          while (payload.length % 4) payload += '=';
          var decoded = JSON.parse(atob(payload));
          return decoded && decoded.email ? decoded.email : null;
        } catch (e) {
          return null;
        }
      }

      async function syncPushNotification(pushNotification) {
        try {
          const appData = JSON.parse(localStorage.getItem('kineq') || '{}');
          const accessToken = appData?.accesstoken || '';
          if (!accessToken) return;

          await fetch(${allowNotifUrl}, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: accessToken,
            },
            body: JSON.stringify({ pushNotification: !!pushNotification }),
          });
        } catch (error) {
          console.error('[OneSignal] pushNotification sync failed', error);
        }
      }

      try {
        window.addEventListener('authChanged', function(){
          try {
            const appData = JSON.parse(localStorage.getItem('kineq') || '{}');
            const token = appData?.accesstoken || null;
            if (!token) {
              try{ document.body.classList.add('hide-onesignal-bell'); }catch(e){}
              OneSignalDeferred.push(async function(OneSignal){
                try{
                  if (OneSignal.logout) {
                    await OneSignal.logout();
                  } else if (OneSignal.removeExternalUserId) {
                    await OneSignal.removeExternalUserId();
                  }
                }catch(err){ console.error('[OneSignal] hide error', err); }
              });
              return;
            }

            try{ document.body.classList.remove('hide-onesignal-bell'); }catch(e){}
            const externalId = decodeJwtEmail(token) || appData?.user?.email || appData?.email || null;
            OneSignalDeferred.push(async function(OneSignal){
              try{
                if (OneSignal.login) {
                  await OneSignal.login(externalId);
                } else if (OneSignal.setExternalUserId) {
                  await OneSignal.setExternalUserId(externalId);
                }

                const currentOptedIn = !!OneSignal?.User?.PushSubscription?.optedIn;
                await syncPushNotification(currentOptedIn);
              }catch(err){ console.error('[OneSignal] show error', err); }
            });
          } catch (err) {
            console.warn('authChanged handler failed', err);
          }
        });
      } catch (e) {}

      try {
        OneSignalDeferred.push(async function(OneSignal){
          try {
            const subscription = OneSignal?.User?.PushSubscription;
            if (!subscription || !subscription.addEventListener) return;

            subscription.addEventListener('change', function(event) {
              try {
                const pushNotification = !!event?.current?.optedIn;
                syncPushNotification(pushNotification);
              } catch (error) {
                console.error('[OneSignal] change listener failed', error);
              }
            });
          } catch (error) {
            console.error('[OneSignal] subscription listener setup failed', error);
          }
        });
      } catch (e) {}

      try{ document.body.classList.add('hide-onesignal-bell'); }catch(e){}
    })();
  `;
}
