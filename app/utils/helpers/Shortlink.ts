import { APP } from '~/utils/config';
import { shortlinkUseCaseResolver } from '~/modules//domain/external/shortlink/usecase/ShortlinkUseCaseResolver';

export const shortenUrlsInContent = async (
  content: string,
): Promise<string> => {
  let _content = content;
  // const urlRegex =
  //   // eslint-disable-next-line no-useless-escape
  //   /https?:\/\/(?:[a-z0-9\-]+\.)+[a-z0-9\-]+(?:\/[^/\s]*)*(?:\?[^\s#]*)?(?:#[^\s]*)?/gi;
  const urlRegex = APP.URL_REGEX;
  const links = _content.match(urlRegex) || [];
  console.log(`shortenUrlsInContent:links:`, links);
  const uniqueLinks = Array.from(new Set(links));
  if (uniqueLinks.length > 0) {
    const shortUrls = await Promise.all(
      uniqueLinks.map((link) => fetchShortUrl(link)),
    );
    console.log(`shortenUrlsInContent:shortUrls:`, shortUrls);
    shortUrls.forEach((shortUrl, i) => {
      // _content = _content.replace(uniqueLinks[i], shortUrl);

      // _content = _content.replace(new RegExp(uniqueLinks[i], 'g'), shortUrl);
      _content = _content.split(uniqueLinks[i]!).join(shortUrl);
    });
    console.log('shortenUrlsInContent:_content:', _content);

    return _content;
  } else {
    return content;
  }
};

const fetchShortUrl = async (link: string) => {
  console.log(`fetchShortUrl:link:`, link);
  console.log(
    `fetchShortUrl:APP.SHORTLINK_DOMAIN:`,
    link.includes(APP.SHORTLINK_DOMAIN),
  );

  const shortUrlCOnesUseCase =
    shortlinkUseCaseResolver.instanceShortlinkCOnesUseCase();

  if (link.includes(APP.SHORTLINK_DOMAIN)) {
    console.log('Link already shortened:', link);
    return link;
  } else {
    const shortUrlCOnesUseCaseCall = await shortUrlCOnesUseCase.call({
      longUrl: link,
    });

    return shortUrlCOnesUseCaseCall.fold(
      (responseFailure) => {
        console.error(
          `fetchShortUrl:shortUrlCOnesUseCaseCall:responseFailure:`,
          responseFailure as any,
        );
        return link;
      },
      (responseSuccees) => {
        const { shortUrl } = responseSuccees;
        console.log(
          `fetchShortUrl:shortUrlCOnesUseCaseCall:responseSuccess:`,
          shortUrl,
        );

        return shortUrl;
      },
    );
  }
};
