import { ExternalReadingPreview } from "../../db/entities/external-reading/preview";
import { InternalReadingPreview } from "../../db/entities/internal-reading/preview";

export type GetLastReadingsResponse<
  K extends InternalReadingPreview | ExternalReadingPreview
> = {
  prototypeId: string;
  readings: K[];
  newLastReading: string | null;
}[];

export type GetLastReadingsParams = {
  prototypeId: string;
  lastReadingId: string | null;
}[];