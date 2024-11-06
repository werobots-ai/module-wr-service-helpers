"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapElasticDateFormatToPromptString = exports.mapElasticDateFormatToMomentArray = exports.mapElasticDateFormatToMomentString = void 0;
const dateFormatMap = {
    // Epoch formats
    epoch_millis: "x",
    epoch_second: "X",
    // Date and optional time
    date_optional_time: ["YYYY-MM-DD[T]HH:mm:ss.SSSZ", "YYYY-MM-DD"],
    strict_date_optional_time: ["YYYY-MM-DD[T]HH:mm:ss.SSSZ", "YYYY-MM-DD"],
    strict_date_optional_time_nanos: [
        "YYYY-MM-DD[T]HH:mm:ss.SSSSSSSSSZ",
        "YYYY-MM-DD",
    ],
    // Basic date formats
    basic_date: "YYYYMMDD",
    basic_date_time: "YYYYMMDD[T]HHmmss.SSSZ",
    basic_date_time_no_millis: "YYYYMMDD[T]HHmmssZ",
    basic_ordinal_date: "YYYYDDD",
    basic_ordinal_date_time: "YYYYDDD[T]HHmmss.SSSZ",
    basic_ordinal_date_time_no_millis: "YYYYDDD[T]HHmmssZ",
    basic_time: "HHmmss.SSSZ",
    basic_time_no_millis: "HHmmssZ",
    basic_t_time: "[T]HHmmss.SSSZ",
    basic_t_time_no_millis: "[T]HHmmssZ",
    basic_week_date: "GGGG[W]WWE",
    basic_week_date_time: "GGGG[W]WWE[T]HHmmss.SSSZ",
    basic_week_date_time_no_millis: "GGGG[W]WWE[T]HHmmssZ",
    // Strict and lenient date formats
    date: "YYYY-MM-DD",
    strict_date: "YYYY-MM-DD",
    date_hour: "YYYY-MM-DD[T]HH",
    strict_date_hour: "YYYY-MM-DD[T]HH",
    date_hour_minute: "YYYY-MM-DD[T]HH:mm",
    strict_date_hour_minute: "YYYY-MM-DD[T]HH:mm",
    date_hour_minute_second: "YYYY-MM-DD[T]HH:mm:ss",
    strict_date_hour_minute_second: "YYYY-MM-DD[T]HH:mm:ss",
    date_hour_minute_second_fraction: "YYYY-MM-DD[T]HH:mm:ss.SSS",
    strict_date_hour_minute_second_fraction: "YYYY-MM-DD[T]HH:mm:ss.SSS",
    date_hour_minute_second_millis: "YYYY-MM-DD[T]HH:mm:ss.SSS",
    strict_date_hour_minute_second_millis: "YYYY-MM-DD[T]HH:mm:ss.SSS",
    date_time: "YYYY-MM-DD[T]HH:mm:ss.SSSZ",
    strict_date_time: "YYYY-MM-DD[T]HH:mm:ss.SSSZ",
    date_time_no_millis: "YYYY-MM-DD[T]HH:mm:ssZ",
    strict_date_time_no_millis: "YYYY-MM-DD[T]HH:mm:ssZ",
    // Time formats
    hour: "HH",
    strict_hour: "HH",
    hour_minute: "HH:mm",
    strict_hour_minute: "HH:mm",
    hour_minute_second: "HH:mm:ss",
    strict_hour_minute_second: "HH:mm:ss",
    hour_minute_second_fraction: "HH:mm:ss.SSS",
    strict_hour_minute_second_fraction: "HH:mm:ss.SSS",
    hour_minute_second_millis: "HH:mm:ss.SSS",
    strict_hour_minute_second_millis: "HH:mm:ss.SSS",
    // Ordinal date formats
    ordinal_date: "YYYY-DDD",
    strict_ordinal_date: "YYYY-DDD",
    ordinal_date_time: "YYYY-DDD[T]HH:mm:ss.SSSZ",
    strict_ordinal_date_time: "YYYY-DDD[T]HH:mm:ss.SSSZ",
    ordinal_date_time_no_millis: "YYYY-DDD[T]HH:mm:ssZ",
    strict_ordinal_date_time_no_millis: "YYYY-DDD[T]HH:mm:ssZ",
    // Week date formats
    week_date: "GGGG-[W]WW-E",
    strict_week_date: "GGGG-[W]WW-E",
    week_date_time: "GGGG-[W]WW-E[T]HH:mm:ss.SSSZ",
    strict_week_date_time: "GGGG-[W]WW-E[T]HH:mm:ss.SSSZ",
    week_date_time_no_millis: "GGGG-[W]WW-E[T]HH:mm:ssZ",
    strict_week_date_time_no_millis: "GGGG-[W]WW-E[T]HH:mm:ssZ",
    // Weekyear formats
    weekyear: "GGGG",
    strict_weekyear: "GGGG",
    weekyear_week: "GGGG-[W]WW",
    strict_weekyear_week: "GGGG-[W]WW",
    weekyear_week_day: "GGGG-[W]WW-E",
    strict_weekyear_week_day: "GGGG-[W]WW-E",
    // Year formats
    year: "YYYY",
    strict_year: "YYYY",
    year_month: "YYYY-MM",
    strict_year_month: "YYYY-MM",
    year_month_day: "YYYY-MM-DD",
    strict_year_month_day: "YYYY-MM-DD",
    // Time with optional 'T' prefix
    time: "HH:mm:ss.SSSZ",
    strict_time: "HH:mm:ss.SSSZ",
    time_no_millis: "HH:mm:ssZ",
    strict_time_no_millis: "HH:mm:ssZ",
    t_time: "[T]HH:mm:ss.SSSZ",
    strict_t_time: "[T]HH:mm:ss.SSSZ",
    t_time_no_millis: "[T]HH:mm:ssZ",
    strict_t_time_no_millis: "[T]HH:mm:ssZ",
};
const mapElasticDateFormatToMomentString = (elasticDateFormat) => {
    return ([].concat(dateFormatMap[elasticDateFormat])[0] || elasticDateFormat);
};
exports.mapElasticDateFormatToMomentString = mapElasticDateFormatToMomentString;
const mapElasticDateFormatToMomentArray = (elasticDateFormat) => {
    return [].concat(dateFormatMap[elasticDateFormat]);
};
exports.mapElasticDateFormatToMomentArray = mapElasticDateFormatToMomentArray;
const mapElasticDateFormatToPromptString = (elasticDateFormat) => {
    return ([].concat(dateFormatMap[elasticDateFormat]) || [elasticDateFormat]).join(" or ");
};
exports.mapElasticDateFormatToPromptString = mapElasticDateFormatToPromptString;
