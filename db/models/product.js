import { DataTypes, Model } from 'sequelize';

class Product extends Model {}

exports.init = function (sequelize) {
  Product.init(
    {
      sku: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('digital', 'hardware', 'kitchenware', 'clothing'),
        allowNull: false
      }
    },
    {
      hooks: {},
      tableName: 'products',
      underscored: true,
      sequelize
    }
  );

  return Product;
};
