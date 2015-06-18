module.exports = {
    bounds: function (photos) {
        var bounds = {
            min_latitude : undefined,
            max_latitude : undefined,
            min_longitude : undefined,
            max_longitude : undefined
        };

        if (photos.length > 0) {
            var photo = photos[0];

            bounds.min_latitude = bounds.max_latitude = photo.location.latitude;
            bounds.min_longitude = bounds.max_longitude = photo.location.longitude;

            photos.slice(1).forEach(function (photo) {
                if (photo.location.latitude < bounds.min_latitude) {
                    bounds.min_latitude = photo.location.latitude;
                }

                if (photo.location.latitude > bounds.max_latitude) {
                    bounds.max_latitude = photo.location.latitude;
                }

                if (photo.location.longitude < bounds.min_longitude) {
                    bounds.min_longitude = photo.location.longitude;
                }

                if (photo.location.longitude > bounds.max_longitude) {
                    bounds.max_longitude = photo.location.longitude;
                }
            });
        }

        return bounds;
    },

    center: function (bounds) {
        return {
            latitude: (bounds.min_latitude + bounds.max_latitude) / 2,
            longitude: (bounds.min_longitude + bounds.max_longitude) / 2
        };
    }
};