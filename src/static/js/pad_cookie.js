/**
 * This code is mostly from the old Etherpad. Please help us to comment this code. 
 * This helps other people to understand this code better and helps them to improve it.
 * TL;DR COMMENTS ON THIS FILE ARE HIGHLY APPRECIATED
 */

/**
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var padcookie = (function()
{
  function getRawCookie()
  {
    // returns null if can't get cookie text
    if (!document.cookie)
    {
      return null;
    }
    // look for (start of string OR semicolon) followed by whitespace followed by prefs=(something);
    var regexResult = document.cookie.match(/(?:^|;)\s*prefs=([^;]*)(?:;|$)/);
    if ((!regexResult) || (!regexResult[1]))
    {
      return null;
    }
    return regexResult[1];
  }

  function setRawCookie(safeText)
  {
    var expiresDate = new Date();
    expiresDate.setFullYear(3000);
    document.cookie = ('prefs=' + safeText + ';expires=' + expiresDate.toGMTString());
  }

  function parseCookie(text)
  {
    // returns null if can't parse cookie.
    try
    {
      var cookieData = JSON.parse(unescape(text));
      return cookieData;
    }
    catch (e)
    {
      return null;
    }
  }

  function stringifyCookie(data)
  {
    return escape(JSON.stringify(data));
  }

  function saveCookie()
  {
    if (!inited)
    {
      return;
    }
    setRawCookie(stringifyCookie(cookieData));

    if (pad.getIsProPad() && (!getRawCookie()) && (!alreadyWarnedAboutNoCookies))
    {
      alert("Avertissement : apparemment votre navigateur n'accepte pas les cookies." + " Framapad Lite emploie des cookies pour tenir le compte des utilisateurs uniques" + " et v&eacute;rifier le quota d'utilisateurs actifs sur le pad. Si vous utilisez Framapad Lite sans " + " cookies vous risquez de d\351passer les quotas de votre serveur plus vite que pr\351vu.");
      alreadyWarnedAboutNoCookies = true;
    }
  }

  var wasNoCookie = true;
  var cookieData = {};
  var alreadyWarnedAboutNoCookies = false;
  var inited = false;

  var pad = undefined;
  var self = {
    init: function(prefsToSet, _pad)
    {
      pad = _pad;

      var rawCookie = getRawCookie();
      if (rawCookie)
      {
        var cookieObj = parseCookie(rawCookie);
        if (cookieObj)
        {
          wasNoCookie = false; // there was a cookie
          delete cookieObj.userId;
          delete cookieObj.name;
          delete cookieObj.colorId;
          cookieData = cookieObj;
        }
      }

      for (var k in prefsToSet)
      {
        cookieData[k] = prefsToSet[k];
      }

      inited = true;
      saveCookie();
    },
    wasNoCookie: function()
    {
      return wasNoCookie;
    },
    getPref: function(prefName)
    {
      return cookieData[prefName];
    },
    setPref: function(prefName, value)
    {
      cookieData[prefName] = value;
      saveCookie();
    }
  };
  return self;
}());

exports.padcookie = padcookie;
